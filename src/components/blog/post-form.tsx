"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import type { Category, Post, Tag } from "@/lib/types";

export function PostForm({ post, categories, tags }: { post?: Post | null; categories: Category[]; tags: Tag[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function save(formData: FormData) {
    setMessage("");
    const response = await fetch(post ? `/api/admin/posts/${post.id}` : "/api/admin/posts", {
      method: post ? "PATCH" : "POST",
      body: formData,
    });
    if (response.ok) router.push("/admin/posts");
    else setMessage(await response.text());
  }

  return (
    <form action={save} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input defaultValue={post?.title} name="title" placeholder="标题" required />
        <Input defaultValue={post?.slug} name="slug" placeholder="slug" required />
      </div>
      <Textarea defaultValue={post?.excerpt} name="excerpt" placeholder="摘要" required />
      <Input defaultValue={post?.cover_url || ""} name="cover_url" placeholder="封面图 URL" />
      <Input accept="image/*" name="cover_file" type="file" />
      <div className="grid gap-4 md:grid-cols-3">
        <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950" defaultValue={post?.category_id || ""} name="category_id">
          <option value="">未分类</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950" defaultValue={post?.status || "draft"} name="status">
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={post?.featured} name="featured" type="checkbox" />
          精选文章
        </label>
      </div>
      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <p className="mb-3 text-sm font-medium">标签</p>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label className="flex items-center gap-2 text-sm" key={tag.id}>
              <input defaultChecked={post?.tags?.some((item) => item.id === tag.id)} name="tag_ids" type="checkbox" value={tag.id} />
              {tag.name}
            </label>
          ))}
        </div>
      </div>
      <Textarea className="min-h-[420px] font-mono" defaultValue={post?.content} name="content" placeholder="Markdown 正文" required />
      <Button type="submit">保存文章</Button>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </form>
  );
}
