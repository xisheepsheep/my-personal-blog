import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/blog", label: "文章" },
  { href: "/projects", label: "项目" },
  { href: "/about", label: "关于" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link className="font-semibold tracking-tight" href="/">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <LinkButton className="hidden sm:inline-flex" href="/admin" variant="secondary">
            后台
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
