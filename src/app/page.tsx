import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCategories, getFeaturedPosts, getPosts, getTags } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export default async function Home() {
  const [{ posts }, featuredPosts, tags, categories] = await Promise.all([
    getPosts({ status: "published", pageSize: 6 }),
    getFeaturedPosts(),
    getTags(),
    getCategories(),
  ]);

  return (
    <div>
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="space-y-7">
            <p className="text-sm font-medium text-cyan-600">技术、学习、项目和生活思考</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{siteConfig.name}</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              我是 {siteConfig.author}，这里记录工程实践、项目复盘和长期学习。内容以中文为主，关注现代 Web、产品打磨和可持续成长。
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/blog">阅读文章</LinkButton>
              <LinkButton href="/about" variant="secondary">
                了解我
              </LinkButton>
            </div>
          </div>
          <Card className="self-end bg-slate-950 text-white dark:bg-slate-900">
            <p className="mb-8 text-sm text-cyan-200">精选主题</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Link className="rounded-md bg-white/10 p-4 hover:bg-white/15" href={`/blog?category=${category.slug}`} key={category.id}>
                  <strong>{category.name}</strong>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{category.description}</p>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">最新文章</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">最近的技术笔记和思考。</p>
          </div>
          <Link className="text-sm font-medium text-cyan-600" href="/blog">
            全部文章
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">{posts.slice(0, 3).map((post) => <PostCard key={post.id} post={post} />)}</div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">热门标签</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">快速进入你感兴趣的话题。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link className="rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-cyan-500 dark:border-slate-800" href={`/blog?tag=${tag.slug}`} key={tag.id}>
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">精选文章</h2>
        <div className="grid gap-5 md:grid-cols-2">{featuredPosts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      </section>
    </div>
  );
}
