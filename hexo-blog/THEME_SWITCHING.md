# Hexo 模板更换指南

Hexo 主题很多，建议优先选仍在维护、文档完整、支持 npm 安装的主题。

## 推荐主题

- `hexo-theme-fluid`：现代、中文文档好、暗色模式和搜索体验成熟
- `hexo-theme-next`：经典稳定、配置项多、适合技术博客
- `hexo-theme-butterfly`：功能丰富、视觉更活泼、插件生态强

## 通用流程

```bash
npm install 主题包名
```

修改 `_config.yml`：

```yaml
theme: 主题名
```

复制主题配置：

```bash
copy node_modules\主题包名\_config.yml _config.主题名.yml
```

验证：

```bash
npm run clean
npm run build
npm run dev
```

## 回到 Fluid

```bash
npm install hexo-theme-fluid
```

`_config.yml`：

```yaml
theme: fluid
```

配置文件：

```text
_config.fluid.yml
```

## 主题切换注意事项

- 不同主题的导航、评论、搜索配置字段不同。
- 文章 Markdown、分类、标签通常可以无缝保留。
- `index_img`、`banner_img` 等封面字段是否生效取决于主题。
- 每次换主题后都要跑 `npm run build`。
