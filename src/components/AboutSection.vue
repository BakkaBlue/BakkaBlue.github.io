<template>
  <section class="section">
    <div class="section-inner">
      <h2 class="section-title">关于我</h2>
      <div class="about-panel glass-card reveal">
        <p class="about-text">
          你好，我是 Cyren，一名技术爱好者（纯半吊子），热衷于探索编程、设计、物联网等领域。离了 AI 轮椅我就是废人一个 —— 但这不妨碍我用 AI 造出好玩的东西。
        </p>
        <p class="about-text about-text-secondary">
          网站还在建设中。♥
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
  max-width: 720px;
  margin: 0 auto;
  padding: 40px;
}

.about-text {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 16px;
}

.about-text-secondary {
  color: var(--text-muted);
  font-size: 1rem;
}
</style>
