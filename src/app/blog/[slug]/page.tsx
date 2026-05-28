import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Comments } from "@/components/blog/comments";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { getComments, getPostBySlug, getPosts } from "@/lib/data";
import { absoluteUrl, formatDate, getReadingMinutes } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      images: post.cover_url ? [post.cover_url] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const [{ posts }, comments] = await Promise.all([getPosts({ status: "published", pageSize: 100 }), getComments(post.id)]);
  const index = posts.findIndex((item) => item.id === post.id);
  const previous = posts[index + 1];
  const next = posts[index - 1];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="space-y-5">
        <div className="flex flex-wrap gap-2 text-sm text-slate-500">
          <Link href={`/blog?category=${post.category?.slug}`}>{post.category?.name || "未分类"}</Link>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>更新于 {formatDate(post.updated_at)}</span>
          <span>·</span>
          <span>{getReadingMinutes(post.content)} 分钟阅读</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Link className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-900" href={`/blog?tag=${tag.slug}`} key={tag.id}>
              #{tag.name}
            </Link>
          ))}
        </div>
      </header>
      {post.cover_url ? <Image alt={post.title} className="my-10 aspect-[16/8] rounded-lg object-cover" height={720} src={post.cover_url} width={1280} priority /> : null}
      <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <p className="mb-3 text-sm font-medium text-slate-500">目录</p>
        <p className="text-sm text-slate-500">标题已自动生成锚点，可通过文章内标题快速定位。</p>
      </div>
      <div className="mt-8">
        <MarkdownContent content={post.content} />
      </div>
      <nav className="mt-12 grid gap-4 sm:grid-cols-2">
        {previous ? <Link className="rounded-lg border border-slate-200 p-4 dark:border-slate-800" href={`/blog/${previous.slug}`}>上一篇<br /><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link className="rounded-lg border border-slate-200 p-4 text-right dark:border-slate-800" href={`/blog/${next.slug}`}>下一篇<br /><strong>{next.title}</strong></Link> : <span />}
      </nav>
      <Comments comments={comments} postId={post.id} />
    </div>
  );
}
