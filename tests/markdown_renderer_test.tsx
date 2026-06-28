import { assertEquals, assertStringIncludes } from "@std/assert";
import { markdownToHast } from "satteri";
import { render as renderToString } from "preact-render-to-string";
import MarkdownRenderer from "../components/MarkdownRenderer.tsx";
import {
  MarkdownRoot,
  stripMarkdownAstPositions,
} from "../lib/markdown_ast.ts";
import { getPost } from "../lib/posts.ts";

Deno.test("stripMarkdownAstPositions removes generated source positions", () => {
  const ast = markdownToHast(
    "## Hello\n\nA **bold** link to [Deno](https://deno.com).",
    {
      features: { gfm: true },
    },
  );

  const stripped = stripMarkdownAstPositions(ast);

  assertEquals(JSON.stringify(stripped).includes("position"), false);
  assertEquals(stripped.type, "root");
  assertEquals(stripped.children.length > 0, true);
});

Deno.test("MarkdownRenderer renders common HAST nodes as Preact HTML", () => {
  const ast = markdownToHast(
    "## Hello\n\nA **bold** list:\n\n- one\n- `two`\n\n[Deno](https://deno.com)",
    { features: { gfm: true } },
  );
  const content = stripMarkdownAstPositions(ast);

  const html = renderToString(<MarkdownRenderer content={content} />);

  assertStringIncludes(html, "<div>");
  assertStringIncludes(
    html,
    '<h2 class="text-3xl mb-3 mt-6 text-whalies-navy dark:text-gray-100">Hello</h2>',
  );
  assertStringIncludes(html, "<strong>bold</strong>");
  assertStringIncludes(
    html,
    '<ul class="list-disc list-outside pl-5 mb-4 dark:text-gray-300">',
  );
  assertStringIncludes(
    html,
    '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono dark:bg-gray-700 dark:text-gray-200">two</code>',
  );
  assertEquals(html.includes("shiki"), false);
  assertStringIncludes(
    html,
    '<a href="https://deno.com" class="text-whalies-dark dark:text-whalies-default underline decoration-2 decoration-whalies-default dark:decoration-whalies-dark hover:text-whalies-default dark:hover:text-whalies-dark transition-colors duration-200">Deno</a>',
  );
});

Deno.test("MarkdownRenderer renders generated Shiki code blocks", () => {
  const post = getPost("code-block-test");
  if (!post) {
    throw new Error("Expected code-block-test post to be generated");
  }

  const html = renderToString(<MarkdownRenderer content={post.content} />);

  assertStringIncludes(html, "shiki shiki-themes");
  assertStringIncludes(html, "catppuccin-latte");
  assertStringIncludes(html, "catppuccin-frappe");
  assertStringIncludes(html, "--shiki-dark");
  assertStringIncludes(html, "pub");
});

Deno.test("MarkdownRenderer drops raw HTML and unsafe properties", () => {
  const content: MarkdownRoot = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "a",
        properties: {
          href: "javascript:alert(1)",
          onClick: "alert(1)",
          className: ["btn", "primary"],
        },
        children: [{ type: "text", value: "unsafe link" }],
      },
      {
        type: "raw",
        value: '<span onclick="alert(1)">raw</span>',
      },
    ],
  };

  const html = renderToString(<MarkdownRenderer content={content} />);

  assertEquals(html.includes("javascript:"), false);
  assertEquals(html.includes("onClick"), false);
  assertEquals(html.includes("onclick"), false);
  assertEquals(html.includes("<span"), false);
  assertStringIncludes(html, "btn primary");
  assertStringIncludes(html, ">unsafe link</a>");
});
