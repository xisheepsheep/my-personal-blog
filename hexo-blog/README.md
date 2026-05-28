# My Personal Blog - Hexo Edition

这是一个基于 Hexo 的个人博客版本，使用现成主题 `hexo-theme-fluid`。它更适合长期写作：文章是 Markdown 文件，图片直接放在文章资源目录里，构建后就是静态站点。

## 常用命令

```bash
npm install
npm run dev
npm run build
```

本地预览：

```bash
npm run dev
```

默认访问 `http://localhost:4000`。

## 写文章

新建文章：

```bash
npm run new:post "文章标题"
```

文章会生成在：

```text
source/_posts/文章标题.md
```

文章顶部使用 front-matter：

```yaml
---
title: 文章标题
date: 2026-05-28 20:00:00
categories:
  - 技术
tags:
  - Hexo
  - Markdown
index_img: https://example.com/cover.jpg
excerpt: 文章摘要
---
```

## 插入图片

当前已开启：

```yaml
post_asset_folder: true
```

推荐做法：

```text
source/_posts/my-post.md
source/_posts/my-post/
  image.png
```

在文章里引用：

```md
![图片说明](my-post/image.png)
```

也可以直接使用外链：

```md
![封面](https://images.unsplash.com/xxx)
```

## 当前主题

当前使用：

```yaml
theme: fluid
```

主题配置文件是：

```text
_config.fluid.yml
```

## 更换模板/主题

Hexo 换主题通常只做三步：安装主题、修改 `_config.yml` 的 `theme`、新增对应主题配置。

### 换成 NexT

```bash
npm install hexo-theme-next
```

修改 `_config.yml`：

```yaml
theme: next
```

然后从主题包复制默认配置：

```bash
copy node_modules\hexo-theme-next\_config.yml _config.next.yml
```

重新构建：

```bash
npm run clean
npm run build
```

### 换成 Butterfly

```bash
npm install hexo-theme-butterfly
```

修改 `_config.yml`：

```yaml
theme: butterfly
```

复制默认配置：

```bash
copy node_modules\hexo-theme-butterfly\_config.yml _config.butterfly.yml
```

重新构建：

```bash
npm run clean
npm run build
```

### 换成其他主题

1. 在 Hexo 主题市场选择主题：https://hexo.io/themes/
2. 按主题文档安装 npm 包或 clone 到 `themes/`
3. 修改 `_config.yml` 的 `theme`
4. 添加 `_config.<theme>.yml`
5. `npm run build` 验证

## 已内置功能

- Fluid 成熟主题
- 文章、分类、标签、归档
- 关于页、项目页
- Markdown 写作
- 文章资源目录图片
- 代码高亮
- 暗色模式
- 本地搜索
- RSS：`/atom.xml`
- Sitemap：`/sitemap.xml`
- Vercel 静态部署配置

## 部署到 Vercel

在 `hexo-blog` 目录执行：

```bash
npx vercel --prod
```

Vercel 配置见：

```text
vercel.json
```

构建命令：

```bash
npm run build
```

输出目录：

```text
public
```
