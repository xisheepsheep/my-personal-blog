import type { Category, Comment, Post, Project, Tag } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-next", name: "前端工程", slug: "frontend", description: "Next.js、React 与工程化" },
  { id: "cat-life", name: "生活思考", slug: "life", description: "学习、阅读与日常观察" },
  { id: "cat-project", name: "项目复盘", slug: "projects", description: "从想法到上线的记录" },
];

export const tags: Tag[] = [
  { id: "tag-next", name: "Next.js", slug: "nextjs" },
  { id: "tag-supa", name: "Supabase", slug: "supabase" },
  { id: "tag-md", name: "Markdown", slug: "markdown" },
  { id: "tag-seo", name: "SEO", slug: "seo" },
];

export const posts: Post[] = [
  {
    id: "post-1",
    title: "用 Next.js 和 Supabase 搭建个人博客",
    slug: "build-blog-with-nextjs-supabase",
    excerpt: "从数据库建模、Markdown 编辑到 Vercel 部署，记录一次完整的博客工程实践。",
    content: `## 为什么选择这套技术栈

Next.js App Router 适合把内容页面、后台管理和 API 放在一个可维护的项目里。Supabase 则提供数据库、认证和对象存储，适合个人项目快速上线。

## 核心能力

- Markdown 写作和代码高亮
- 分类、标签和搜索
- 评论审核
- SEO、RSS、sitemap

\`\`\`ts
export function helloBlog(name: string) {
  return \`Hello, \${name}\`;
}
\`\`\`

## 下一步

接入真实域名、完善图片处理，并把文章编辑器继续增强。`,
    cover_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop",
    status: "published",
    featured: true,
    views: 128,
    published_at: "2026-05-01T09:00:00.000Z",
    created_at: "2026-04-30T09:00:00.000Z",
    updated_at: "2026-05-02T09:00:00.000Z",
    category_id: "cat-next",
    category: categories[0],
    tags: [tags[0], tags[1], tags[2]],
  },
  {
    id: "post-2",
    title: "写给自己的项目复盘模板",
    slug: "project-retrospective-template",
    excerpt: "一个帮助自己沉淀项目经验的复盘结构：目标、约束、取舍、结果和下一步。",
    content: `## 复盘不只是总结

好的复盘会保留当时的约束和选择，而不是只记录结果。

### 我常用的结构

1. 目标是什么
2. 最难的问题是什么
3. 做了哪些取舍
4. 下次会如何改进`,
    cover_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    status: "published",
    featured: true,
    views: 76,
    published_at: "2026-04-18T09:00:00.000Z",
    created_at: "2026-04-17T09:00:00.000Z",
    updated_at: "2026-04-18T09:00:00.000Z",
    category_id: "cat-project",
    category: categories[2],
    tags: [tags[2]],
  },
  {
    id: "post-3",
    title: "让个人站点更容易被发现",
    slug: "personal-site-seo-checklist",
    excerpt: "一个轻量 SEO 清单：标题、描述、Open Graph、结构化链接和 RSS。",
    content: `## SEO 的基本面

个人博客不用过度复杂，先确保每个页面有明确标题、描述和稳定 URL。

## 必备项

- sitemap.xml
- robots.txt
- RSS
- Open Graph 图片`,
    cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    status: "published",
    featured: false,
    views: 54,
    published_at: "2026-03-21T09:00:00.000Z",
    created_at: "2026-03-20T09:00:00.000Z",
    updated_at: "2026-03-21T09:00:00.000Z",
    category_id: "cat-next",
    category: categories[0],
    tags: [tags[3], tags[0]],
  },
];

export const comments: Comment[] = [
  {
    id: "comment-1",
    post_id: "post-1",
    author_name: "读者",
    author_email: "reader@example.com",
    content: "这篇很实用，尤其是部署和权限部分。",
    status: "approved",
    created_at: "2026-05-03T10:00:00.000Z",
  },
];

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Content Studio",
    slug: "content-studio",
    description: "面向个人创作者的 Markdown 内容管理小工具。",
    tech_stack: ["Next.js", "Supabase", "Tailwind CSS"],
    repo_url: "https://github.com/alex/content-studio",
    demo_url: "https://example.com",
    featured: true,
    created_at: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "project-2",
    title: "Deploy Notes",
    slug: "deploy-notes",
    description: "记录部署流程、环境变量和故障排查的知识库。",
    tech_stack: ["TypeScript", "PostgreSQL", "Vercel"],
    repo_url: null,
    demo_url: "https://example.com",
    featured: false,
    created_at: "2026-02-08T09:00:00.000Z",
  },
];
