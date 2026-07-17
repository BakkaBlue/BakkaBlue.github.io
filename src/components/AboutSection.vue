<template>
  <section id="about" class="section">
    <div class="section-inner about-grid">
      <header class="section-header">
        <p class="section-kicker">About</p>
        <h2 class="section-title">关于我</h2>
        <p class="section-desc">不追求无所不能，只想把喜欢的东西认真做完。</p>
      </header>

      <div class="about-panel glass-card reveal">
        <p class="about-text">
          你好，我是 Cyren，一名技术爱好者（纯半吊子），热衷于探索编程、设计与物联网。
          离了 AI 轮椅我就是废人一个 —— 但这不妨碍我用 AI 造出好玩的东西。
        </p>
        <p class="about-text about-muted">
          网站还在建设中。♥ 目前更在意气质：干净、安静、有一点余光。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// presentation only
</script>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 36px;
  align-items: start;
}

.about-panel {
  padding: 36px 34px;
}

.about-text {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 16px;
}

.about-muted {
  color: var(--text-muted);
  font-size: 0.98rem;
  margin-bottom: 0;
}

@media (max-width: 860px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
