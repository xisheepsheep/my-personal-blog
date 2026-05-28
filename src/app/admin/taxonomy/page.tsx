import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCategories, getTags } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase";

export const metadata = { title: "分类标签管理" };
export const dynamic = "force-dynamic";

export default async function TaxonomyPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect(`/admin/login?reason=${admin.status}`);
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">分类和标签</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold">分类</h2>
          <form action="/api/admin/categories" className="mb-5 grid gap-3" method="post">
            <Input name="name" placeholder="分类名称" required />
            <Input name="slug" placeholder="slug" required />
            <Input name="description" placeholder="描述" />
            <Button type="submit">新增分类</Button>
          </form>
          <div className="space-y-3">
            {categories.map((category) => (
              <form action={`/api/admin/categories/${category.id}`} className="grid gap-2 rounded-md border border-slate-200 p-3 dark:border-slate-800" key={category.id} method="post">
                <input name="_method" type="hidden" value="PATCH" />
                <Input defaultValue={category.name} name="name" />
                <Input defaultValue={category.slug} name="slug" />
                <Input defaultValue={category.description || ""} name="description" />
                <div className="flex gap-3">
                  <Button type="submit" variant="secondary">保存</Button>
                  <button formAction={`/api/admin/categories/${category.id}?_method=DELETE`} className="text-sm text-red-600" type="submit">删除</button>
                </div>
              </form>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-semibold">标签</h2>
          <form action="/api/admin/tags" className="mb-5 grid gap-3" method="post">
            <Input name="name" placeholder="标签名称" required />
            <Input name="slug" placeholder="slug" required />
            <Button type="submit">新增标签</Button>
          </form>
          <div className="space-y-3">
            {tags.map((tag) => (
              <form action={`/api/admin/tags/${tag.id}`} className="grid gap-2 rounded-md border border-slate-200 p-3 dark:border-slate-800" key={tag.id} method="post">
                <input name="_method" type="hidden" value="PATCH" />
                <Input defaultValue={tag.name} name="name" />
                <Input defaultValue={tag.slug} name="slug" />
                <div className="flex gap-3">
                  <Button type="submit" variant="secondary">保存</Button>
                  <button formAction={`/api/admin/tags/${tag.id}?_method=DELETE`} className="text-sm text-red-600" type="submit">删除</button>
                </div>
              </form>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
