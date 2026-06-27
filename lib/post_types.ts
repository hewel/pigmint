import type { MarkdownRoot } from "./markdown_ast.ts";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: MarkdownRoot;
  readingTime: number;
  tags: string[];
  author?: string;
}
