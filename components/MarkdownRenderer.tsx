import { ComponentChildren } from "preact";
import { Lexer, Token, Tokens } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";

interface MarkdownRendererProps {
  content: string;
}

// Highlight code using Prism
function highlightCode(code: string, lang: string): string {
  const language = lang || "plaintext";
  if (Prism.languages[language]) {
    return Prism.highlight(code, Prism.languages[language], language);
  }
  return escapeHtml(code);
}

// Escape HTML entities
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Render inline tokens (bold, italic, code, links, etc.)
function renderInline(tokens: Token[]): ComponentChildren {
  return tokens.map((token, index) => {
    switch (token.type) {
      case "text":
        return <span key={index}>{token.text}</span>;

      case "strong":
        return (
          <strong key={index} class="font-bold">
            {renderInline((token as Tokens.Strong).tokens)}
          </strong>
        );

      case "em":
        return (
          <em key={index} class="italic">
            {renderInline((token as Tokens.Em).tokens)}
          </em>
        );

      case "codespan":
        return (
          <code
            key={index}
            class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
          >
            {(token as Tokens.Codespan).text}
          </code>
        );

      case "link":
        return (
          <a
            key={index}
            href={(token as Tokens.Link).href}
            title={(token as Tokens.Link).title || undefined}
            class="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-300 dark:decoration-blue-600 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors"
          >
            {renderInline((token as Tokens.Link).tokens)}
          </a>
        );

      case "image":
        return (
          <img
            key={index}
            src={(token as Tokens.Image).href}
            alt={(token as Tokens.Image).text}
            title={(token as Tokens.Image).title || undefined}
            class="max-w-full h-auto rounded-lg border-2 border-black dark:border-gray-500"
          />
        );

      case "br":
        return <br key={index} />;

      case "del":
        return (
          <del key={index} class="line-through">
            {renderInline((token as Tokens.Del).tokens)}
          </del>
        );

      case "escape":
        return <span key={index}>{(token as Tokens.Escape).text}</span>;

      default:
        // Fallback for unknown inline tokens
        if ("text" in token) {
          return <span key={index}>{(token as { text: string }).text}</span>;
        }
        return null;
    }
  });
}

// Render a single block token
function renderToken(token: Token, index: number): ComponentChildren {
  switch (token.type) {
    case "heading": {
      const headingToken = token as Tokens.Heading;
      const HeadingTag =
        `h${headingToken.depth}` as keyof preact.JSX.IntrinsicElements;
      const headingClasses: Record<number, string> = {
        1: "text-4xl mb-6 mt-8 font-cartoon",
        2: "text-3xl mb-4 mt-8 font-cartoon",
        3: "text-2xl mb-3 mt-6 font-cartoon",
        4: "text-xl mb-2 mt-4 font-cartoon",
        5: "text-lg mb-2 mt-3 font-cartoon",
        6: "text-base mb-2 mt-3 font-cartoon",
      };
      return (
        <HeadingTag key={index} class={headingClasses[headingToken.depth]}>
          {renderInline(headingToken.tokens)}
        </HeadingTag>
      );
    }

    case "paragraph":
      return (
        <p key={index} class="mb-4 leading-relaxed">
          {renderInline((token as Tokens.Paragraph).tokens)}
        </p>
      );

    case "code": {
      const codeToken = token as Tokens.Code;
      const lang = codeToken.lang || "plaintext";
      const highlighted = highlightCode(codeToken.text, lang);
      return (
        <div key={index} class="relative mb-6 group">
          <div class="absolute top-0 right-0 px-3 py-1 text-xs font-mono text-gray-400 bg-gray-800 rounded-bl-lg rounded-tr-xl border-l-2 border-b-2 border-gray-700">
            {lang}
          </div>
          <pre class="bg-gray-900 text-gray-100 p-4 pt-8 rounded-xl overflow-x-auto border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(75,85,99,1)]">
            <code
              class={`language-${lang}`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        </div>
      );
    }

    case "blockquote":
      return (
        <blockquote
          key={index}
          class="border-l-4 border-pastel-pink pl-4 my-4 italic bg-pastel-pink/20 py-2 rounded-r-lg"
        >
          {renderTokens((token as Tokens.Blockquote).tokens)}
        </blockquote>
      );

    case "list": {
      const listToken = token as Tokens.List;
      const ListTag = listToken.ordered ? "ol" : "ul";
      const listClass = listToken.ordered
        ? "list-decimal list-inside mb-4 space-y-1"
        : "list-disc list-inside mb-4 space-y-1";
      return (
        <ListTag key={index} class={listClass} start={listToken.start || 1}>
          {listToken.items.map((item, i) => (
            <li key={i} class="leading-relaxed">
              {item.tokens ? renderTokens(item.tokens) : item.text}
            </li>
          ))}
        </ListTag>
      );
    }

    case "hr":
      return (
        <hr
          key={index}
          class="my-8 border-t-4 border-dashed border-gray-300 dark:border-gray-600"
        />
      );

    case "table": {
      const tableToken = token as Tokens.Table;
      return (
        <div key={index} class="overflow-x-auto mb-6">
          <table class="min-w-full border-2 border-black dark:border-gray-500 rounded-lg overflow-hidden">
            <thead class="bg-pastel-blue">
              <tr>
                {tableToken.header.map((cell, i) => (
                  <th
                    key={i}
                    class="px-4 py-2 text-left font-bold border-b-2 border-black dark:border-gray-500"
                  >
                    {renderInline(cell.tokens)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableToken.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  class={
                    rowIndex % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-700"
                  }
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      class="px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                    >
                      {renderInline(cell.tokens)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "html":
      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: (token as Tokens.HTML).text }}
        />
      );

    case "space":
      return null;

    default:
      // Fallback for unknown tokens
      if ("tokens" in token && Array.isArray(token.tokens)) {
        return <div key={index}>{renderTokens(token.tokens)}</div>;
      }
      if ("text" in token) {
        return <p key={index}>{(token as { text: string }).text}</p>;
      }
      return null;
  }
}

// Render an array of tokens
function renderTokens(tokens: Token[]): ComponentChildren {
  return tokens.map((token, index) => renderToken(token, index));
}

// Main component
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lexer = new Lexer();
  const tokens = lexer.lex(content);

  return <div class="markdown-body">{renderTokens(tokens)}</div>;
}
