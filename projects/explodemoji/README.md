# explodemoji

网页端工具：自选 emoji，调爆炸样式与参数，**实时预览**并**导出 GIF**。

- 纯前端（Vite + TypeScript + Canvas）
- Twemoji 位图，跨平台外观一致
- 四种样式：Burst / Fountain / Spiral / Shatter
- **3D 爆炸**：球面初速 + 深度透视分层；碎片先全部冲上天，再飘落
- 浏览器端编码 GIF（[gifenc](https://github.com/mattdesl/gifenc)）

## 使用

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址，选 emoji、调参数，点 **导出 GIF**。

生产构建：

```bash
npm run build
npm run preview
```

`dist/` 可直接静态托管（`base: './'`，相对路径友好）。

## 参数说明

| 参数 | 说明 |
|------|------|
| 样式 | 径向爆炸 / 喷泉 / 螺旋 / 重力碎裂 |
| 碎片数量 | 4–400，就近取整为 N×N（最多约 20×20） |
| 力度 | 0.1–8，初速度倍率 |
| 重力 | −800–4000（负值向上飘） |
| 阻力 / 旋转 | 0–0.15 / 0–10 |
| 缩放起止 | 0.05–4 |
| 爆炸时长 / FPS | 0.3–6s（+0.5s 定格）/ 8–60 |
| 画布尺寸 | 128–1024 |
| 背景 | 纯色或透明（GIF 透明兼容性因查看器而异） |

## 技术要点

- 预览与导出共用同一套粒子 `init` / `step` / `drawFrame`，固定 seed 保证一致
- 网格角点抖动 + 部分三角形碎块；clip 多边形绘制 UV 纹理
- 时间线：`HOLD_DURATION(0.5s)` 完整图 → 3D 冲天爆炸 → 下落飘落
- 绘制：按 z 排序 + 透视缩放/位移，近大远小、翻面缩扁
- Emoji 资源：jsDelivr 上的 Twemoji `72x72` PNG（运行时按需拉取，失败时 clip + 系统 emoji 兜底）
- 导出时主线程分片 `quantize`，UI 显示帧进度

## 许可

代码 MIT。Twemoji 图形遵循 Twitter 的 CC-BY 4.0 许可，使用时请保留署名。
