export type MarkdownPropertyValue =
  | string
  | number
  | boolean
  | Array<string | number>
  | null
  | undefined;

export interface MarkdownRoot {
  type: "root";
  children: MarkdownNode[];
}

export interface MarkdownElement {
  type: "element";
  tagName: string;
  properties?: Record<string, MarkdownPropertyValue>;
  children?: MarkdownNode[];
}

export interface MarkdownText {
  type: "text";
  value: string;
}

export interface MarkdownIgnoredNode {
  type: "raw" | "comment" | "doctype";
  value?: string;
}

export type MarkdownNode =
  | MarkdownRoot
  | MarkdownElement
  | MarkdownText
  | MarkdownIgnoredNode;

export function stripMarkdownAstPositions(root: unknown): MarkdownRoot {
  return stripPositionFields(root) as MarkdownRoot;
}

function stripPositionFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripPositionFields);
  }

  if (!isRecord(value)) {
    return value;
  }

  const stripped: Record<string, unknown> = {};
  for (const [key, childValue] of Object.entries(value)) {
    if (key === "position") continue;
    stripped[key] = stripPositionFields(childValue);
  }

  return stripped;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
