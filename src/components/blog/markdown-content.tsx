import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert prose-pre:rounded-lg prose-pre:bg-slate-950">
      <ReactMarkdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeHighlight]} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
