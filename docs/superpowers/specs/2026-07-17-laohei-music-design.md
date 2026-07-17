# Laohei Music 统一播放页设计

## 概述

将分散在 `music1/` ~ `music5/` 的 5 首音乐整合到一个统一的播放页面 `laohei-music/index.html`，采用千禧年早期互联网风格（Winamp 播放器 + Geocities 霓虹点缀）。

## 页面结构

### 1. 星空闪烁背景
- 深色渐变背景 (`#0a0a2e` → `#1a1a3e`)
- CSS animation 实现随机分布的闪烁星星
- 移动的横向星光线条

### 2. 霓虹发光标题区
- "Laohei Music" 使用 CSS text-shadow 多层霓虹发光效果（粉色/紫色系）
- 像素风格副标题使用 `<marquee>` 式滚动效果

### 3. Winamp 风格播放器（核心）
- 深灰色边框 + 立体斜面 (bevel) 效果
- 左上角：CSS 跳动条模拟均衡器
- 中央：曲目信息（歌名 + 艺人 "还会见面吗"）+ 旋转封面
- 绿色进度条（Winamp 经典配色 `#39ff14`）
- 像素风格控制按钮：上一首 / 播放暂停 / 下一首
- 右侧：播放列表，5 首曲目，当前播放高亮

### 4. 底部装饰
- 仿古访客计数器
- "Best viewed in 1024x768" 标语
- "Made with Notepad" 等怀旧标识

## 技术方案

- **纯静态**：HTML + CSS + 原生 JS，无框架依赖
- **音频路径**：`../music{1-5}/mp3/music1.mp3`
- **封面路径**：`../music{1-5}/img/bg.jpg`
- **歌名**："1" ~ "5"，艺人："还会见面吗"
- 使用 HTML5 `<audio>` + 原生 JS API 控制播放

## 功能要求

- [x] 5 首曲目统一播放列表
- [x] 点击列表 / 上下首按钮切换曲目
- [x] 播放/暂停控制
- [x] 进度条可点击跳转
- [x] 播放中封面旋转动画
- [x] 当前播放曲目高亮

## 清理工作

完成后删除旧的独立音乐文件夹：
- `music1/` ~ `music5/`（含子目录）
- `css/style.css`（如无其他页面引用）
- `js/index.js`（如无其他页面引用）
- `font/`（如无其他页面引用）

**注**：`js/jquery-3.4.1.min.js` 如无其他页面依赖也一并清理。

## 部署

通过现有 GitHub Actions workflow (`deploy.yml`) 自动部署到 GitHub Pages。`laohei-music/` 目录会被 `rsync` 复制到 `_site/`，最终通过 `https://bakkablue.github.io/laohei-music` 访问。
