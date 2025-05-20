import { marked } from "marked";

export default function MarkdownPreview({ content }: { content: string }) {
  return (
    <div
      className="h-96 overflow-y-auto bg-neutral-900 border border-neutral-700 p-4 rounded prose prose-invert"
      dangerouslySetInnerHTML={{ __html: marked(content || "") }}
    />
  );
}
