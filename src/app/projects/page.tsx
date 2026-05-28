import { Code2, ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getProjects } from "@/lib/data";

export const metadata = {
  title: "项目",
  description: "Alex 的个人项目展示。",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">项目</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">一些正在打磨或已经完成的个人项目。</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-slate-900" key={tech}>{tech}</span>)}
            </div>
            <div className="mt-5 flex gap-4 text-sm">
              {project.repo_url ? <a className="flex items-center gap-1 text-cyan-600" href={project.repo_url}><Code2 className="h-4 w-4" />源码</a> : null}
              {project.demo_url ? <a className="flex items-center gap-1 text-cyan-600" href={project.demo_url}><ExternalLink className="h-4 w-4" />预览</a> : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
