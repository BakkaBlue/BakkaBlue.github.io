# 博客文章目录

在此目录新增 Markdown 文件即可发布文章。

## 文件名 = slug

```
content/blog/my-first-post.md
→ https://yoursite/blog/my-first-post
```

## Frontmatter

```md
---
title: 标题
excerpt: 列表摘要
date: 2026-07-19
tags:
  - 标签A
  - 标签B
---

正文从这里开始，支持常见 Markdown：标题、列表、链接、代码块、引用等。
```

构建时由 Vite 自动扫描本目录并编译为 HTML，无需改 TypeScript。
