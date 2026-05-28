import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.author}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/rss.xml">RSS</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
          <a href={`mailto:${siteConfig.social.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}
