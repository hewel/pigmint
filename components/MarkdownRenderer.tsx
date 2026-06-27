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
  return <div class="markdown-body">{renderMarkdownNode(content, "root")}</div>;
}

export function renderMarkdownNode(
  node: MarkdownNode,
  key: string,
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
      return renderElementNode(node, key);
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
): ComponentChildren {
  const children = (node.children ?? []).map((child, index) =>
    renderMarkdownNode(child, `${key}-${index}`)
  );

  return h(
    node.tagName,
    { ...normalizeProperties(node.properties), key },
    ...children,
  );
}

function normalizeProperties(
  properties: Record<string, MarkdownPropertyValue> | undefined,
): Record<string, unknown> {
  if (!properties) return {};

  const normalized: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(properties)) {
    if (value === undefined || value === null) continue;
    if (isEventLikeProperty(name)) continue;
    if (isUrlProperty(name) && typeof value === "string" && !isSafeUrl(value)) {
      continue;
    }

    if (name === "className") {
      normalized.class = normalizeClassName(value);
      continue;
    }

    normalized[name] = value;
  }

  return normalized;
}

function normalizeClassName(value: MarkdownPropertyValue): unknown {
  if (Array.isArray(value)) {
    return value.join(" ");
  }

  return value;
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
