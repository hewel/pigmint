import { assertEquals, assertStringIncludes } from "@std/assert";
import { markdownToHast } from "satteri";
import { render as renderToString } from "preact-render-to-string";
import MarkdownRenderer from "../components/MarkdownRenderer.tsx";
import {
  MarkdownRoot,
  stripMarkdownAstPositions,
} from "../lib/markdown_ast.ts";

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

  assertStringIncludes(html, '<div class="markdown-body">');
  assertStringIncludes(html, "<h2>Hello</h2>");
  assertStringIncludes(html, "<strong>bold</strong>");
  assertStringIncludes(html, "<ul>");
  assertStringIncludes(html, "<code>two</code>");
  assertStringIncludes(html, '<a href="https://deno.com">Deno</a>');
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
  assertStringIncludes(html, '<a class="btn primary">unsafe link</a>');
});
