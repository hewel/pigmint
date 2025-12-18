import { extract } from "@std/front-matter/any";
import { stringify } from "@std/toml";
import { join } from "@std/path";
import { getConfig } from "../utils.ts";
import { escapeXml } from "../lib/security.ts";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readingTime: number;
  tags: string[];
  author?: string;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
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

      posts.push({
        slug,
        title: attributes.title,
        date: attributes.date,
        excerpt: attributes.excerpt,
        content: processedBody,
        readingTime: calculateReadingTime(body),
        tags: attributes.tags || [],
        author: attributes.author || "Anonymous",
      });
    }
  }

  // Sort posts by date desc
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 3. Generate posts.toml
  const postsToml = stringify({ posts });
  await Deno.writeTextFile(join(postsDir, "posts.toml"), postsToml);
  console.log("Generated posts.toml");

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
