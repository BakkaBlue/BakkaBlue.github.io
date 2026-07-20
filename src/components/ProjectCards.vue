<template>
  <section class="section page-shell">
    <header class="section-header">
      <p class="section-kicker">Projects</p>
      <h2 class="section-title">我的小项目</h2>
      <p class="section-desc">几个能直接打开的入口，保持轻量和可玩。</p>
    </header>

    <div class="list">
      <a
        v-for="(project, i) in projects"
        :key="project.title"
        :href="project.link"
        class="card row reveal"
        :class="'reveal-delay-' + (i + 1)"
      >
        <div>
          <div class="meta">
            <span class="idx">0{{ i + 1 }}</span>
            <span class="tag">{{ project.tag }}</span>
          </div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.desc }}</p>
        </div>
        <span class="go">{{ project.linkText }} →</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
const projects = [
  {
    title: 'Idle Realms · 放置王国',
    desc: '基于时间累积的多技能放置类 RPG',
    link: 'idle_realms/',
    linkText: '进入游戏',
    tag: 'Game',
  },
  {
    title: 'Color Wordle',
    desc: '每日颜色猜词挑战，考验你的色感',
    link: 'color_wordle/',
    linkText: '开始挑战',
    tag: 'Puzzle',
  },
  {
    title: 'Laohei Music',
    desc: '统一音乐播放页，听听老黑的歌',
    link: 'laohei-music/',
    linkText: '听歌去',
    tag: 'Music',
  },
]
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  padding: 20px 22px;
  color: inherit;
}

.row:hover {
  transform: translateY(-2px);
}

.meta {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.idx {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.tag {
  font-size: 0.72rem;
  color: var(--text-muted);
  background: var(--bg-soft);
  border-radius: 999px;
  padding: 3px 8px;
}

h3 {
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

p {
  color: var(--text-secondary);
}

.go {
  color: var(--accent);
  white-space: nowrap;
  font-weight: 500;
}

@media (max-width: 700px) {
  .row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
