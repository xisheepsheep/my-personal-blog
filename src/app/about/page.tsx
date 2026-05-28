import { Code2, Mail } from "lucide-react";

import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "关于",
  description: "Alex 的个人介绍、技能和联系方式。",
};

export default function AboutPage() {
  const skills = ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "产品工程"];
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">关于 {siteConfig.author}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
        我关注现代 Web 工程、内容产品和长期主义学习。这个站点用于记录技术实践、项目复盘，以及那些在日常中慢慢成形的想法。
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold">技能</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-900" key={skill}>{skill}</span>)}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-semibold">联系方式</h2>
          <div className="space-y-3 text-sm">
            <a className="flex items-center gap-2" href={`mailto:${siteConfig.social.email}`}><Mail className="h-4 w-4" />{siteConfig.social.email}</a>
            <a className="flex items-center gap-2" href={siteConfig.social.github}><Code2 className="h-4 w-4" />GitHub</a>
          </div>
        </Card>
      </div>
    </div>
  );
}
