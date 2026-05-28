import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { formatDate, getReadingMinutes } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden p-0">
      {post.cover_url ? (
        <Link href={`/blog/${post.slug}`}>
          <Image alt={post.title} className="h-48 w-full object-cover" height={420} src={post.cover_url} width={760} />
        </Link>
      ) : null}
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{post.category?.name || "未分类"}</span>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{getReadingMinutes(post.content)} 分钟阅读</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-semibold tracking-tight hover:text-cyan-600">{post.title}</h2>
        </Link>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Link className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300" href={`/blog?tag=${tag.slug}`} key={tag.id}>
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
