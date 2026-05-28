# My Personal Blog

一个基于 Next.js App Router、TypeScript、Tailwind CSS、shadcn/ui 风格组件和 Supabase 的个人博客网站。前台支持文章、分类、标签、搜索、评论、暗色模式、SEO、RSS；后台支持管理员登录、文章 CRUD、分类标签管理、评论审核和封面图上传。

## 功能列表

- 首页、文章列表、文章详情、关于、项目页
- Markdown 渲染、代码高亮、阅读时间、上一篇/下一篇
- 分类、标签、搜索、分页
- Supabase Auth 管理员登录
- 文章增删改查、发布/草稿、精选文章
- Supabase Storage 封面图上传
- 评论提交和后台审核
- SEO metadata、Open Graph、`sitemap.xml`、`robots.txt`、`rss.xml`
- 暗色/亮色模式和响应式布局

## 技术栈

- Next.js App Router + TypeScript
- Tailwind CSS v4
- shadcn/ui 风格的本地组件
- Supabase Database/Auth/Storage
- Vercel
- ESLint + Prettier

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目 Settings > API 中的 Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase Project API anon public key
- `SUPABASE_SERVICE_ROLE_KEY`：Supabase service_role key，只放服务端和 Vercel 环境变量
- `ADMIN_EMAIL`：允许访问后台的管理员邮箱
- `NEXT_PUBLIC_SITE_URL`：公网地址，本地为 `http://localhost:3000`

未配置 Supabase 时，前台会使用内置示例数据，后台会提示需要配置。

## Supabase 配置

1. 新建 Supabase 项目。
2. 打开 SQL Editor，执行 `supabase/init.sql`。
3. 在 Authentication > Users 创建一个用户，邮箱必须等于 `ADMIN_EMAIL`。
4. 在 Storage 中确认 `covers` bucket 存在且 public 为 true。
5. 在 Database 设置中运行：

```sql
alter database postgres set app.admin_email = '你的管理员邮箱';
```

如果你使用本项目的 API Route 写入数据，服务端会用 `SUPABASE_SERVICE_ROLE_KEY` 执行后台操作；RLS 仍用于保护客户端直接访问。

## 后台管理员

访问 `/admin/login`，使用 Supabase Auth 中创建的管理员邮箱和密码登录。只有 `ADMIN_EMAIL` 匹配的用户可以进入 `/admin` 和调用后台 API。

## Vercel 部署

1. 将项目推送到 GitHub。
2. 在 Vercel 导入仓库。
3. 添加所有环境变量。
4. 将 `NEXT_PUBLIC_SITE_URL` 设置为 Vercel 分配域名或自定义域名。
5. 部署后访问 `/admin/login`。

## 常见问题

- 后台提示 503：缺少 Supabase 环境变量。
- 登录后仍无法进入后台：检查 `ADMIN_EMAIL` 是否和 Supabase 用户邮箱完全一致。
- 封面图上传失败：确认 `covers` bucket 已创建且 service role key 已配置。
- 文章不显示：确认文章状态为 `published` 且有 `published_at`。

## 后续可扩展

- MDX 自定义组件
- 图片裁剪和压缩
- 评论邮件通知
- 全文搜索 RPC
- 文章浏览量统计
- 项目后台管理
