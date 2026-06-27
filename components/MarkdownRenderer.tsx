import { type ComponentChildren, Fragment, h } from "preact";
import {
  MarkdownElement,
  MarkdownNode,
  MarkdownPropertyValue,
  MarkdownRoot,
} from "../lib/markdown_ast.ts";

interface MarkdownRendererProps {
  content: MarkdownRoot;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <div>{renderMarkdownNode(content, "root")}</div>;
}

export function renderMarkdownNode(
  node: MarkdownNode,
  key: string,
  parentTagName?: string,
): ComponentChildren {
  switch (node.type) {
    case "root":
      return h(
        Fragment,
        null,
        ...node.children.map((child, index) =>
          renderMarkdownNode(child, `${key}-${index}`)
        ),
      );
    case "text":
      return node.value;
    case "element":
      return renderElementNode(node, key, parentTagName);
    case "raw":
    case "comment":
    case "doctype":
      return null;
    default:
      return null;
  }
}

function renderElementNode(
  node: MarkdownElement,
  key: string,
  parentTagName: string | undefined,
): ComponentChildren {
  const children = (node.children ?? []).map((child, index) =>
    renderMarkdownNode(child, `${key}-${index}`, node.tagName)
  );

  return h(
    node.tagName,
    {
      ...normalizeProperties(node.tagName, parentTagName, node.properties),
      key,
    },
    ...children,
  );
}

function normalizeProperties(
  tagName: string,
  parentTagName: string | undefined,
  properties: Record<string, MarkdownPropertyValue> | undefined,
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  const baseClass = getMarkdownTagClass(tagName, parentTagName);

  if (properties) {
    for (const [name, value] of Object.entries(properties)) {
      if (value === undefined || value === null) continue;
      if (isEventLikeProperty(name)) continue;
      if (
        isUrlProperty(name) && typeof value === "string" && !isSafeUrl(value)
      ) {
        continue;
      }

      if (name === "className") {
        normalized.class = mergeClassNames(
          baseClass,
          normalizeClassName(value),
        );
        continue;
      }

      normalized[name] = value;
    }
  }

  if (baseClass && !normalized.class) {
    normalized.class = baseClass;
  }

  return normalized;
}

function normalizeClassName(value: MarkdownPropertyValue): unknown {
  if (Array.isArray(value)) {
    return value.join(" ");
  }

  return value;
}

function mergeClassNames(...values: unknown[]): string | undefined {
  const classes = values
    .flatMap((value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return String(value).split(/\s+/);
    })
    .filter(Boolean);

  return classes.length > 0 ? classes.join(" ") : undefined;
}

function isEventLikeProperty(name: string): boolean {
  return name.toLowerCase().startsWith("on");
}

function isUrlProperty(name: string): boolean {
  return name === "href" || name === "src";
}

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") return false;
  if (trimmed.startsWith("#")) return true;
  if (trimmed.startsWith("//")) return false;

  const normalized = stripUrlNoise(trimmed);
  const protocolMatch = normalized.match(/^([a-z][a-z0-9+.-]*):/);
  if (!protocolMatch) return true;

  return ["http:", "https:", "mailto:", "tel:"].includes(protocolMatch[0]);
}

function stripUrlNoise(value: string): string {
  let normalized = "";
  for (const char of value) {
    const codePoint = char.codePointAt(0);
    if (codePoint === undefined) continue;
    if (codePoint <= 0x20 || codePoint === 0x7f) continue;
    normalized += char;
  }

  return normalized.toLowerCase();
}

function getMarkdownTagClass(
  tagName: string,
  parentTagName: string | undefined,
): string | undefined {
  if (tagName === "code" && parentTagName === "pre") {
    return markdownTagClasses.preCode;
  }

  return markdownTagClasses[tagName];
}

const markdownTagClasses: Record<string, string> = {
  h1: "text-4xl mb-4 text-whalies-navy dark:text-gray-100",
  h2: "text-3xl mb-3 mt-6 text-whalies-navy dark:text-gray-100",
  h3: "text-2xl mb-2 mt-4 text-whalies-navy dark:text-gray-100",
  p: "mb-4 leading-relaxed dark:text-gray-300",
  ul: "list-disc list-outside pl-5 mb-4 dark:text-gray-300",
  ol: "list-decimal list-outside pl-5 mb-4 dark:text-gray-300",
  a: "text-whalies-dark dark:text-whalies-default underline decoration-2 decoration-whalies-default dark:decoration-whalies-dark hover:text-whalies-default dark:hover:text-whalies-dark transition-colors duration-200",
  pre:
    "p-4 rounded-4xl overflow-x-auto mb-4 border-2 border-whalies-navy shadow-cartoon bg-[var(--code-bg)] text-[var(--code-text)]",
  code:
    "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono dark:bg-gray-700 dark:text-gray-200",
  preCode: "bg-transparent p-0 border-none shadow-none font-mono text-sm",
};
