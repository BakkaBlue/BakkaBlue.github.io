<template>
  <section id="about" class="section">
    <div class="section-inner">
      <h2 class="section-title glitch-title" data-text="关于我">关于我</h2>
      <div class="about-panel glass-card reveal">
        <div class="about-scanline" aria-hidden="true"></div>
        <p class="about-text">
          你好，我是 Cyren，一名技术爱好者（纯半吊子），热衷于探索编程、设计、物联网等领域。离了 AI 轮椅我就是废人一个 —— 但这不妨碍我用 AI 造出好玩的东西。
        </p>
        <p class="about-text about-text-secondary">
          网站还在建设中。♥ 不过炫技模块已经先上线了。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 纯展示组件
</script>

<style scoped>
.about-panel {
  max-width: 760px;
  margin: 0 auto;
  padding: 42px;
  position: relative;
  overflow: hidden;
}

.about-scanline {
  position: absolute;
  left: 0;
  right: 0;
  height: 120%;
  top: -10%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in srgb, var(--accent) 18%, transparent) 50%,
    transparent 100%
  );
  opacity: 0.35;
  animation: scan 4.5s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { transform: translateY(-60%); }
  100% { transform: translateY(60%); }
}

.about-text {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.about-text-secondary {
  color: var(--text-muted);
  font-size: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  .about-scanline {
    animation: none;
    opacity: 0.12;
  }
}
</style>
