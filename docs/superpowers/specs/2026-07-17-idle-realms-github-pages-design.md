# Idle Realms 部署到 GitHub Pages — 设计文档

日期：2026-07-17
状态：已获用户批准

## 背景与问题

仓库 `BakkaBlue/BakkaBlue.github.io` 是 GitHub 用户主页仓库（根目录为个人主页静态站，另含 `color_wordle/` 小游戏）。`projects/idle_realms/` 是一个 Vue 3 + Vite + TypeScript 的放置类 RPG，纯前端、存档用 localStorage、无后端依赖，天生适合 GitHub Pages。

当前部署已损坏，诊断出的问题：

1. **白屏根因**：`projects/idle_realms/vite.config.ts` 未设置 `base`，构建产物以 `/assets/index-*.js` 绝对根路径引用资源。部署在 `bakkablue.github.io/idle_realms/` 子目录下时资源 404，页面白屏。
2. **仓库膨胀**：`projects/idle_realms/node_modules/`（约 2000 个文件）与 `projects/idle_realms/dist/` 被提交进 git；整个仓库没有任何 `.gitignore`。
3. **工作流 bug**：`.github/workflows/deploy.yml` 的 `paths` 过滤器引用了错误的文件名 `deploy-idle-realms.yml`（实际文件名为 `deploy.yml`）。
4. **favicon 缺失**：游戏 `index.html` 引用 `/favicon.ico`，该文件不存在。
5. 个人主页（根 `index.html`）没有任何项目入口链接。

源码中没有运行时以绝对路径 `fetch` 资源的代码（主题 JSON 等均为静态 import），因此除 `base` 配置外游戏代码无需改动。

## 选定方案

**方案 B：官方 GitHub Pages Actions 部署**（用户在 A「修现有 commit-back 工作流」/ B / C「本地手动构建」中选定 B）。

- main 分支只含源码，零构建产物。
- 每次 push 到 main：Actions 跑测试 → 构建 idle_realms → 组装整站 artifact → `actions/deploy-pages` 直接发布。
- 根目录旧的 `idle_realms/` 构建产物目录从 git 删除，由 CI 组装取代。

## 架构

```
main 分支（纯源码）
├── index.html, css/, js/, img/, font/, music*/   ← 主页静态内容，原样
├── color_wordle/                                  ← 纯静态小游戏，原样
├── projects/idle_realms/                          ← 游戏源码（不再跟踪 node_modules、dist）
└── .github/workflows/deploy.yml                   ← 官方 Pages 部署工作流

CI 组装逻辑：
_site/ = 仓库根目录静态内容（排除 projects/、.git*、.kagent/、docs/）
_site/idle_realms/ = projects/idle_realms/dist/ 构建产物
```

## 改动清单

| # | 文件 | 改动 |
|---|---|---|
| 1 | `projects/idle_realms/vite.config.ts` | 加 `base: './'`。项目无路由、构建产物为单 JS 文件（无代码分割），相对路径安全且不绑定部署目录名。 |
| 2 | `.github/workflows/deploy.yml` | 重写：触发条件为 `push` 到 main（不限制 paths，主页改动同样触发整站部署）+ `workflow_dispatch`；权限 `pages: write`、`id-token: write`、`contents: read`；`concurrency: pages`。build job：checkout → setup-node 22（npm 缓存指向 `projects/idle_realms/package-lock.json`）→ `npm ci` → `npm test`（vitest）→ `npm run build`（含 vue-tsc 类型检查）→ rsync 组装 `_site/` → `upload-pages-artifact`。deploy job：`actions/deploy-pages`，environment `github-pages`。 |
| 3 | 新建根 `.gitignore` | `node_modules/`、`projects/idle_realms/dist/`、`.kagent/`（本地代码索引缓存）、`_site/`。 |
| 4 | git 清理 | `git rm -r --cached`：`projects/idle_realms/node_modules/`、`projects/idle_realms/dist/`、`.kagent/`（本地文件保留）。`git rm -r idle_realms/`（根目录旧构建产物，彻底删除）。 |
| 5 | `projects/idle_realms/index.html` | `/favicon.ico` 引用改为内联 SVG emoji（🏰）data URI，不新增文件。 |
| 6 | 根 `index.html` | 在「关于我」下方加「我的小项目」区块，链接 `idle_realms/` 与 `color_wordle/`，风格沿用现有内联 CSS。 |

## 需要用户手动操作的一步

代码 push 后，到 GitHub 仓库 **Settings → Pages → Build and deployment → Source**，从 "Deploy from a branch" 改为 **"GitHub Actions"**。在此之前旧的分支部署仍然生效，切换后由工作流接管。

## 错误处理

- CI 中测试失败或构建失败即中止，不部署（fail fast）。
- `npm run build` 已含 `vue-tsc -b`，类型错误会阻断部署。
- 部署使用官方 action，失败时 Actions 日志可直接定位。

## 验证方式

1. **本地**：`npm run build` 后检查 `dist/index.html` 资源路径为 `./assets/...`；以仓库根为站点根起本地静态服务器，访问 `/idle_realms/` 确认游戏加载、控制台无 404。
2. **CI**：vitest 通过、构建成功、Actions 全绿。
3. **线上**：访问 `bakkablue.github.io/idle_realms/` 确认游戏运行；主页与 `color_wordle/` 不受影响。

## 明确不做（YAGNI）

- 不改游戏本身的任何逻辑代码。
- 不引入自定义域名、PR 预览等额外 Pages 功能。
- 不重构主页样式，只追加一个区块。
- `projects/idle_realms/settingsdemo.html`、`server.ps1` 等开发辅助文件保持原样，不随站点发布（组装时整目录排除 `projects/`）。
