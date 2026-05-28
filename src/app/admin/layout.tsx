import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/posts", label: "文章" },
  { href: "/admin/taxonomy", label: "分类标签" },
  { href: "/admin/comments", label: "评论" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-2">
        <p className="mb-4 text-sm text-slate-500">后台管理</p>
        {links.map((link) => (
          <Link className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </aside>
      <section>{children}</section>
    </div>
  );
}
