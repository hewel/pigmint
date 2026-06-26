// deno-lint-ignore-file react-no-danger -- content is Satteri-rendered at build time from owner-authored posts.
interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div
      class="markdown-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
