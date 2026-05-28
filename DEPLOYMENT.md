# 部署文档

## 1. 本地检查

```bash
npm install
npm run lint
npm run build
```

## 2. 初始化 Supabase

1. 创建 Supabase 项目。
2. 在 SQL Editor 执行 `supabase/init.sql`。
3. 创建管理员用户，邮箱与 `.env.local` 的 `ADMIN_EMAIL` 保持一致。
4. 复制 Project URL、anon key、service role key。

## 3. 配置环境变量

本地 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon key
SUPABASE_SERVICE_ROLE_KEY=你的 service role key
ADMIN_EMAIL=你的管理员邮箱
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Vercel 中添加同名变量，并把 `NEXT_PUBLIC_SITE_URL` 改为公网域名。

## 4. GitHub 和 Vercel

当前机器没有检测到 `git` 命令时，可手动：

```bash
git init
git add .
git commit -m "Initial personal blog"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

然后在 Vercel 选择 Import Git Repository，框架会自动识别为 Next.js。

## 5. Vercel CLI 可选部署

如果已安装并登录 Vercel CLI：

```bash
npx vercel
npx vercel --prod
```

## 6. 部署后验证

- `/` 首页可访问
- `/blog` 可以筛选和搜索
- `/rss.xml`、`/sitemap.xml`、`/robots.txt` 返回正常
- `/admin/login` 可以登录
- `/admin/posts` 可以新建、编辑、删除文章
- 评论默认 pending，后台审核后展示
