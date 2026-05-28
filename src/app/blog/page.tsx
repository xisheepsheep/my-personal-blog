import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCategories, getPosts, getTags } from "@/lib/data";

export const metadata = {
  title: "文章",
  description: "Alex 的技术博客文章列表，支持搜索、分类和标签筛选。",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const pageSize = 6;
  const [{ posts, count }, categories, tags] = await Promise.all([
    getPosts({ query: params.q, category: params.category, tag: params.tag, page, pageSize, status: "published" }),
    getCategories(),
    getTags(),
  ]);
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-5">
        <Card>
          <form action="/blog" className="space-y-3">
            <Input defaultValue={params.q} name="q" placeholder="搜索文章" />
            <button className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-950">搜索</button>
          </form>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">分类</h2>
          <div className="space-y-2 text-sm">
            <Link className="block text-slate-600 dark:text-slate-300" href="/blog">全部</Link>
            {categories.map((category) => (
              <Link className="block text-slate-600 hover:text-cyan-600 dark:text-slate-300" href={`/blog?category=${category.slug}`} key={category.id}>
                {category.name}
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">标签</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link className="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-slate-900" href={`/blog?tag=${tag.slug}`} key={tag.id}>
                #{tag.name}
              </Link>
            ))}
          </div>
        </Card>
      </aside>

      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">文章</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">共 {count} 篇已发布文章。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
        <div className="mt-8 flex items-center justify-between text-sm">
          <Link className={page <= 1 ? "pointer-events-none text-slate-400" : "text-cyan-600"} href={`/blog?page=${page - 1}`}>
            上一页
          </Link>
          <span>第 {page} / {totalPages} 页</span>
          <Link className={page >= totalPages ? "pointer-events-none text-slate-400" : "text-cyan-600"} href={`/blog?page=${page + 1}`}>
            下一页
          </Link>
        </div>
      </section>
    </div>
  );
}
