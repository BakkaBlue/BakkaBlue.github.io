# Idle Realms 部署到 GitHub Pages 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) 语法用于追踪。

**Goal:** 让 idle_realms 在 `bakkablue.github.io/idle_realms/` 正常运行，仓库转为官方 GitHub Pages Actions 部署，并清理误提交的 node_modules/dist。

**Architecture:** main 分支只含源码。每次 push：Actions 跑 vitest → `vite build`（`base: './'` 相对路径修复白屏根因）→ 把根目录静态内容与 dist 组装成 `_site/` artifact → `actions/deploy-pages` 发布。根目录旧构建产物 `idle_realms/` 从 git 删除。

**Tech Stack:** Vue 3 + Vite 6 + TypeScript + vitest；GitHub Actions（`actions/upload-pages-artifact@v3`、`actions/deploy-pages@v4`）。

**规格文档:** `docs/superpowers/specs/2026-07-17-idle-realms-github-pages-design.md`

## Global Constraints

- 仓库根目录：`c:\Users\BakkaBlue\Documents\Coding Shits\github.io`（Windows；命令一律在 Git Bash 中运行）
- 不改动游戏逻辑代码，只改构建/部署配置、`.gitignore`、两个 index.html
- CI Node 版本固定 22；`npm ci` 依赖 `projects/idle_realms/package-lock.json`（已确认存在）
- 所有 git 提交在 `main` 分支上进行（该仓库既有工作流即直推 main）
- 提交信息末尾附 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- CI 组装 `_site/` 时排除：`_site`、`.git`、`.github`、`.kagent`、`docs`、`projects`、`.gitignore`、`package-lock.json`

---

### Task 1: 修复 vite base 路径与 favicon

**Files:**
- Modify: `projects/idle_realms/vite.config.ts`
- Modify: `projects/idle_realms/index.html:7`

**Interfaces:**
- Consumes: 无
- Produces: `npm run build` 产出的 `dist/index.html` 中资源引用为 `./assets/...` 相对路径（Task 5 本地验证、Task 3 CI 构建依赖此行为）

- [ ] **Step 1: 给 vite.config.ts 加 `base: './'`**

将 `projects/idle_realms/vite.config.ts` 的 `defineConfig` 块改为（新增 `base` 一行，其余不动）：

```ts
export default defineConfig({
  base: './',
  plugins: [vue()],
  clearScreen: false,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
})
```

- [ ] **Step 2: 替换 favicon 引用为内联 SVG emoji**

`projects/idle_realms/index.html` 第 7 行：

旧：
```html
  <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
```

新：
```html
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏰</text></svg>" />
```

- [ ] **Step 3: 构建并验证产物路径为相对路径**

```bash
cd projects/idle_realms && npm run build
```
预期：构建成功（含 vue-tsc 类型检查）。然后：

```bash
grep -o 'src="[^"]*"' dist/index.html && grep -o 'href="[^"]*assets[^"]*"' dist/index.html
```
预期输出包含 `src="./assets/index-....js"` 与 `href="./assets/index-....css"`（以 `./` 开头，不再是 `/assets/`）。

- [ ] **Step 4: 跑一遍测试确认无回归**

```bash
cd projects/idle_realms && npm test
```
预期：vitest 全部 PASS（改动只涉及构建配置，不应影响任何测试）。

- [ ] **Step 5: Commit**

```bash
git add projects/idle_realms/vite.config.ts projects/idle_realms/index.html
git commit -m "fix: vite base 改为相对路径，修复子目录部署白屏；favicon 改内联 SVG

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 新建 .gitignore 并清理 git 跟踪

**Files:**
- Create: `.gitignore`（仓库根）
- Delete from index only（本地文件保留）: `projects/idle_realms/node_modules/`、`projects/idle_realms/dist/`、`.kagent/`
- Delete completely: `idle_realms/`（根目录旧构建产物）

**Interfaces:**
- Consumes: 无
- Produces: git 中不再有 node_modules/dist/.kagent；根目录不再有 `idle_realms/`（Task 3 的 CI 组装以及 Task 5 的本地组装假设根目录 `idle_realms/` 不存在）

- [ ] **Step 1: 创建根 `.gitignore`**

内容（精确写入）：

```gitignore
node_modules/
projects/idle_realms/dist/
.kagent/
_site/
```

- [ ] **Step 2: 从 git 索引移除误提交内容（保留本地文件）**

```bash
git rm -r --cached projects/idle_realms/node_modules
git rm -r --cached projects/idle_realms/dist
git rm -r --cached .kagent
```
预期：大量 `rm '...'` 输出，无报错。本地文件仍在磁盘上（`ls projects/idle_realms/node_modules` 仍有内容）。

- [ ] **Step 3: 彻底删除根目录旧构建产物**

```bash
git rm -r idle_realms
```
预期：删除 `idle_realms/index.html`、`idle_realms/assets/index-DeSttvKB.css`、`idle_realms/assets/index-DtOxvalE.js` 共 3 个文件，目录从磁盘消失。

- [ ] **Step 4: 验证清理结果**

```bash
git ls-files | grep -c node_modules; git ls-files | grep -c '^idle_realms/'; git ls-files | grep -c '.kagent'
```
预期：三个计数全部为 `0`。

```bash
git status --short | head -5
```
预期：只看到 staged 的删除（`D`）与新增的 `.gitignore`（`A`），没有 node_modules 出现在未跟踪列表（被 ignore）。

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git commit -m "chore: 添加 .gitignore，移除误提交的 node_modules/dist/.kagent 与旧构建产物

main 分支改为只含源码，构建产物由 CI 组装（见 deploy.yml 重写）。

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: 重写部署工作流

**Files:**
- Modify（整文件替换）: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: Task 1 的相对路径构建产物；Task 2 后根目录无 `idle_realms/`
- Produces: push 到 main 即整站部署到 GitHub Pages（`_site/` 布局 = 根目录静态内容 + `_site/idle_realms/` = dist）

- [ ] **Step 1: 用以下内容整体替换 `.github/workflows/deploy.yml`**

```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: projects/idle_realms/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: projects/idle_realms

      - name: Run tests
        run: npm test
        working-directory: projects/idle_realms

      - name: Build Idle Realms
        run: npm run build
        working-directory: projects/idle_realms

      - name: Assemble site
        run: |
          mkdir _site
          rsync -a \
            --exclude '_site' \
            --exclude '.git' \
            --exclude '.github' \
            --exclude '.kagent' \
            --exclude 'docs' \
            --exclude 'projects' \
            --exclude '.gitignore' \
            --exclude 'package-lock.json' \
            ./ _site/
          mkdir -p _site/idle_realms
          cp -R projects/idle_realms/dist/. _site/idle_realms/

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 语法自查**

逐项核对（无本地 actionlint，人工核对以下清单）：
- `on.push.branches` 为 `main`，含 `workflow_dispatch`
- `permissions` 三项：`contents: read`、`pages: write`、`id-token: write`
- build job 每个 `run` 步骤的 `working-directory` 正确（npm 三步在 `projects/idle_realms`，Assemble 在仓库根）
- deploy job 有 `environment.name: github-pages` 且 `needs: build`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: 改用官方 GitHub Pages Actions 整站部署

构建 idle_realms 后与根目录静态内容组装为 artifact 直接发布，
main 分支不再提交构建产物；同时修复旧 paths 过滤器文件名错误。

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: 个人主页添加「我的小项目」区块

**Files:**
- Modify: `index.html`（仓库根，约 :104-111 之间）

**Interfaces:**
- Consumes: 无
- Produces: 主页可点击进入 `idle_realms/` 与 `color_wordle/`

- [ ] **Step 1: 在 `<style>` 块内 `.social-links a:hover` 规则之后追加样式**

在根 `index.html` 的 `.social-links a:hover { ... }`（约 :65-67）之后插入：

```css
        .projects {
            margin-top: 30px;
        }

        .projects a {
            display: inline-block;
            margin: 10px 15px;
            padding: 12px 24px;
            background-color: #333;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 1.2rem;
        }

        .projects a:hover {
            background-color: #0073e6;
        }
```

- [ ] **Step 2: 在第二段 `.bio`（「网站还在建设中。♥」）与 `.social-links` 之间插入区块**

```html
        <h2>我的小项目</h2>
        <div class="projects">
            <a href="idle_realms/">Idle Realms · 放置王国</a>
            <a href="color_wordle/">Color Wordle</a>
        </div>
```

- [ ] **Step 3: 本地打开验证**

```bash
start index.html
```
预期：浏览器打开主页，「我的小项目」区块出现在「关于我」内容之后、社交链接之前，两个按钮样式与页面灰黑配色一致。（链接本身此时点击 404 属正常——目录尚未组装，线上验证见 Task 6。）

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: 主页添加「我的小项目」区块，链接 idle_realms 与 color_wordle

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: 本地整站模拟验证

**Files:**
- 无新文件（`_site/` 为临时目录，已被 .gitignore 覆盖）

**Interfaces:**
- Consumes: Task 1 构建产物、Task 2 目录布局、Task 4 主页改动
- Produces: 部署前的端到端信心；发现问题则回到对应 Task 修复

- [ ] **Step 1: 按 CI 同样逻辑在本地组装 `_site/`**

在仓库根（Git Bash，本地无 rsync 用 cp 等价实现）：

```bash
rm -rf _site && mkdir _site
cp index.html _site/
cp -r css js img font music1 music2 music3 music4 music5 color_wordle _site/ 2>/dev/null
mkdir -p _site/idle_realms
cp -r projects/idle_realms/dist/. _site/idle_realms/
ls _site && ls _site/idle_realms
```
预期：`_site/` 含主页全部静态内容；`_site/idle_realms/` 含 `index.html` 与 `assets/`。

- [ ] **Step 2: 起本地静态服务器**

```bash
npx --yes http-server _site -p 8080 --silent &
```
预期：服务器在 8080 端口运行。

- [ ] **Step 3: 验证主页、游戏页、游戏资源全部 200**

```bash
curl -s -o /dev/null -w "home: %{http_code}\n" http://localhost:8080/
curl -s -o /dev/null -w "game: %{http_code}\n" http://localhost:8080/idle_realms/
for a in $(curl -s http://localhost:8080/idle_realms/ | grep -o 'assets/[^"]*'); do
  curl -s -o /dev/null -w "$a: %{http_code}\n" "http://localhost:8080/idle_realms/$a"
done
curl -s -o /dev/null -w "wordle: %{http_code}\n" http://localhost:8080/color_wordle/
```
预期：全部输出 `200`。任何 404 → 停下，回到 Task 1（资源路径）或本步 Step 1（组装遗漏）排查。

- [ ] **Step 4: 浏览器冒烟测试**

```bash
start http://localhost:8080/idle_realms/
```
预期：游戏界面正常渲染（非白屏），浏览器控制台无红色 404/JS 报错。

- [ ] **Step 5: 停止服务器并清理**

```bash
kill %1 2>/dev/null; rm -rf _site
```
预期：端口释放，临时目录删除。无需提交（本 Task 不产生文件改动）。

---

### Task 6: 推送、切换 Pages 设置、线上验证

**Files:**
- 无文件改动（推送与线上验证）

**Interfaces:**
- Consumes: Task 1-5 的全部提交
- Produces: `bakkablue.github.io/idle_realms/` 线上可玩

- [ ] **Step 1: 推送到 main**

```bash
git push origin main
```
预期：推送成功，Actions 自动触发 "Deploy site to GitHub Pages"。

- [ ] **Step 2: 【用户手动】切换 Pages 部署源**

提醒用户操作：GitHub 仓库 → **Settings → Pages → Build and deployment → Source** → 从 "Deploy from a branch" 改为 **"GitHub Actions"**。首个工作流运行若在切换前 deploy job 失败，切换后用 Actions 页面的 "Re-run jobs"（或 `workflow_dispatch`）重跑即可。

- [ ] **Step 3: 等待并确认 Actions 全绿**

```bash
gh run watch --repo BakkaBlue/BakkaBlue.github.io 2>/dev/null || echo "gh 不可用，请在 https://github.com/BakkaBlue/BakkaBlue.github.io/actions 查看"
```
预期：build（含 vitest、vue-tsc、vite build）与 deploy 两个 job 均成功。

- [ ] **Step 4: 线上验证**

```bash
curl -s -o /dev/null -w "home: %{http_code}\n" https://bakkablue.github.io/
curl -s -o /dev/null -w "game: %{http_code}\n" https://bakkablue.github.io/idle_realms/
curl -s -o /dev/null -w "wordle: %{http_code}\n" https://bakkablue.github.io/color_wordle/
```
预期：全部 `200`。浏览器打开 `https://bakkablue.github.io/idle_realms/` 游戏正常运行，主页「我的小项目」入口可点击。（Pages CDN 可能有 1-2 分钟缓存延迟。）

- [ ] **Step 5: 收尾**

全部验证通过后，向用户确认完成；如规格文档所列目标全部达成，本计划文件可保留作为记录。
