import { extract } from "@std/front-matter/any";
import { join } from "@std/path";
import { markdownToHast } from "satteri";
import { codeToHast } from "shiki";
import type {
  MarkdownElement,
  MarkdownNode,
  MarkdownRoot,
} from "../lib/markdown_ast.ts";
import { getConfig } from "../utils.ts";
import { escapeXml } from "../lib/security.ts";
import { stripMarkdownAstPositions } from "../lib/markdown_ast.ts";
import type { Post } from "../lib/post_types.ts";

const SHIKI_THEMES = {
  light: "catppuccin-latte",
  dark: "catppuccin-frappe",
} as const;

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

async function highlightCodeBlocks(node: MarkdownNode): Promise<MarkdownNode> {
  if (node.type !== "root" && node.type !== "element") {
    return node;
  }

  const children = await Promise.all(
    node.children?.map((child) => highlightCodeBlocks(child)) ?? [],
  );

  const nextNode = { ...node, children };
  if (nextNode.type !== "element" || nextNode.tagName !== "pre") {
    return nextNode;
  }

  const codeElement = getCodeElement(nextNode);
  if (!codeElement) {
    return nextNode;
  }

  return await highlightCodeElement(codeElement, nextNode);
}

async function highlightMarkdownRoot(
  root: MarkdownRoot,
): Promise<MarkdownRoot> {
  return await highlightCodeBlocks(root) as MarkdownRoot;
}

function getCodeElement(preElement: MarkdownElement): MarkdownElement | null {
  const codeElement = preElement.children?.find((child) =>
    child.type === "element" && child.tagName === "code"
  );

  return codeElement?.type === "element" ? codeElement : null;
}

async function highlightCodeElement(
  codeElement: MarkdownElement,
  fallbackElement: MarkdownElement,
): Promise<MarkdownElement> {
  const code = getTextContent(codeElement);
  const lang = getCodeLanguage(codeElement) ?? "text";
  const shikiRoot = await codeToHastWithFallback(code, lang);
  const highlightedPre = shikiRoot.children.find((child) =>
    child.type === "element" && child.tagName === "pre"
  );

  return highlightedPre?.type === "element" ? highlightedPre : fallbackElement;
}

async function codeToHastWithFallback(
  code: string,
  lang: string,
): Promise<MarkdownRoot> {
  try {
    return await codeToHast(code, {
      lang,
      themes: SHIKI_THEMES,
    }) as MarkdownRoot;
  } catch (error) {
    if (lang === "text") {
      throw error;
    }

    return await codeToHast(code, {
      lang: "text",
      themes: SHIKI_THEMES,
    }) as MarkdownRoot;
  }
}

function getTextContent(node: MarkdownNode): string {
  switch (node.type) {
    case "text":
      return node.value;
    case "root":
    case "element":
      return node.children?.map(getTextContent).join("") ?? "";
    default:
      return "";
  }
}

function getCodeLanguage(codeElement: MarkdownElement): string | undefined {
  const dataLang = codeElement.data?.lang;
  if (typeof dataLang === "string" && dataLang.trim()) {
    return dataLang.trim();
  }

  const className = codeElement.properties?.className ??
    codeElement.properties?.class;
  const classes = Array.isArray(className) ? className : [className];
  const languageClass = classes
    .flatMap((value) => String(value ?? "").split(/\s+/))
    .find((value) => value.startsWith("language-"));

  return languageClass?.replace(/^language-/, "") || undefined;
}

async function main() {
  console.log("Generating content...");

  // 1. Read Config
  const config = await getConfig();
  const baseUrl = config.base.url.replace(/\/$/, "");
  const postsDir = config.base.postsDir || "./posts";

  // 2. Read Posts
  const posts: Post[] = [];
  for await (const dirEntry of Deno.readDir(postsDir)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
      const slug = dirEntry.name.replace(".md", "");
      const path = join(postsDir, dirEntry.name);
      const fileContent = await Deno.readTextFile(path);
      const { attrs, body } = extract(fileContent);
      const attributes = attrs as {
        title: string;
        date: string;
        excerpt: string;
        tags?: string[];
        author?: string;
      };

      let processedBody = body;
      // Remove the title from the body if it's the first heading
      const titleHeading = `# ${attributes.title}`;
      if (processedBody.startsWith(titleHeading)) {
        processedBody = processedBody.substring(titleHeading.length).trim();
      }

      const hast = markdownToHast(processedBody, {
        features: { gfm: true },
      });
      const content = await highlightMarkdownRoot(
        stripMarkdownAstPositions(hast),
      );

      posts.push({
        slug,
        title: attributes.title,
        date: attributes.date,
        excerpt: attributes.excerpt,
        content,
        readingTime: calculateReadingTime(body),
        tags: attributes.tags || [],
        author: attributes.author || "Anonymous",
      });
    }
  }

  // Sort posts by date desc
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 3. Generate runtime post module
  const generatedPostsSource =
    `// This file is generated by scripts/gen_content.ts.
// Do not edit manually.

import type { Post } from "./post_types.ts";

export const posts: Post[] = ${JSON.stringify(posts, null, 2)};
`;
  await Deno.writeTextFile("lib/posts.generated.ts", generatedPostsSource);
  console.log("Generated lib/posts.generated.ts");

  // 4. Generate static/sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ${
    posts
      .map(
        (post) => `
  <url>
    <loc>${baseUrl}/${escapeXml(post.slug)}</loc>
    <lastmod>${escapeXml(post.date)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
      )
      .join("")
  }
</urlset>`;

  await Deno.writeTextFile("static/sitemap.xml", sitemap);
  console.log("Generated static/sitemap.xml");

  // 5. Generate static/feed.xml (RSS)
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Pigmint</title>
  <link>${baseUrl}</link>
  <description>A fresh, colorful, and bold space for thoughts.</description>
  ${
    posts
      .map(
        (post) => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${baseUrl}/${escapeXml(post.slug)}</link>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <guid>${baseUrl}/${escapeXml(post.slug)}</guid>
  </item>`,
      )
      .join("")
  }
</channel>
</rss>`;

  await Deno.writeTextFile("static/feed.xml", rss);
  console.log("Generated static/feed.xml");

  // 6. Generate static/robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  await Deno.writeTextFile("static/robots.txt", robots);
  console.log("Generated static/robots.txt");
}

main();
