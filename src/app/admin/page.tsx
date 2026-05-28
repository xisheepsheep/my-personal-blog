import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/data";
import { requireAdmin } from "@/lib/supabase";

export const metadata = { title: "后台仪表盘" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect(`/admin/login?reason=${admin.status}`);
  const stats = await getDashboardStats();
  const items = [
    ["文章数量", stats.posts],
    ["评论数量", stats.comments],
    ["分类数量", stats.categories],
    ["标签数量", stats.tags],
  ];
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">仪表盘</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {items.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <strong className="mt-3 block text-3xl">{value}</strong>
          </Card>
        ))}
      </div>
    </div>
  );
}
