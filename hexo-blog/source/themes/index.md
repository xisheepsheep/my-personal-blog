---
title: Hexo 模板切换
date: 2026-05-28 20:30:00
---

这个博客当前使用的是成熟主题 **Fluid**。Hexo 的好处是主题和文章内容相对独立，文章仍然是 Markdown 文件，换模板时通常不用改文章。

## 当前模板

```yaml
theme: fluid
```

主题配置文件：

```text
_config.fluid.yml
```

## 推荐模板

| 模板 | 适合场景 | 安装包 |
| --- | --- | --- |
| Fluid | 现代、简洁、中文文档完整 | `hexo-theme-fluid` |
| NexT | 经典技术博客、配置稳定 | `hexo-theme-next` |
| Butterfly | 功能丰富、视觉更活泼 | `hexo-theme-butterfly` |

## 切换到 NexT

```bash
cd hexo-blog
npm install hexo-theme-next
```

修改 `_config.yml`：

```yaml
theme: next
```

复制主题配置：

```bash
copy node_modules\hexo-theme-next\_config.yml _config.next.yml
```

验证：

```bash
npm run clean
npm run build
npm run dev
```

## 切换到 Butterfly

```bash
cd hexo-blog
npm install hexo-theme-butterfly
```

修改 `_config.yml`：

```yaml
theme: butterfly
```

复制主题配置：

```bash
copy node_modules\hexo-theme-butterfly\_config.yml _config.butterfly.yml
```

验证：

```bash
npm run clean
npm run build
npm run dev
```

## 切回 Fluid

```bash
cd hexo-blog
npm install hexo-theme-fluid
```

修改 `_config.yml`：

```yaml
theme: fluid
```

继续使用：

```text
_config.fluid.yml
```

## 换模板时要检查什么

- 导航栏配置是否需要改。
- 搜索、RSS、sitemap 是否仍然正常生成。
- 文章封面字段，比如 `index_img`、`banner_img`，新主题是否支持。
- 评论系统配置是否需要重新接入。
- `npm run build` 是否能通过。

## 去哪里找更多模板

Hexo 官方主题市场：

https://hexo.io/themes/

挑模板时优先看这几个点：

- 最近是否还在维护
- 是否支持 npm 安装
- 是否有中文或英文完整文档
- 是否支持移动端、暗色模式、搜索和目录
