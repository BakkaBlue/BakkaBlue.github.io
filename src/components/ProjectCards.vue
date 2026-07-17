<template>
  <section id="projects" class="section">
    <div class="section-inner">
      <header class="section-header">
        <p class="section-kicker">Selected Work</p>
        <h2 class="section-title">我的小项目</h2>
        <p class="section-desc">几个能直接打开的入口，保持轻量和可玩。</p>
      </header>

      <div class="projects-list">
        <a
          v-for="(project, i) in projects"
          :key="project.title"
          :href="project.link"
          class="project-row glass-card reveal"
          :class="'reveal-delay-' + (i + 1)"
        >
          <div class="project-main">
            <span class="project-index">0{{ i + 1 }}</span>
            <div>
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-desc">{{ project.desc }}</p>
            </div>
          </div>
          <div class="project-meta">
            <span class="project-tag">{{ project.tag }}</span>
            <span class="project-go">{{ project.linkText }} →</span>
          </div>
        </a>
      </div>
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
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 26px;
  text-decoration: none;
  color: inherit;
}

.project-main {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  min-width: 0;
}

.project-index {
  color: var(--text-muted);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  padding-top: 5px;
  flex-shrink: 0;
}

.project-title {
  font-size: 1.12rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.project-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.project-tag {
  font-size: 0.76rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  padding: 6px 10px;
}

.project-go {
  color: var(--accent);
  font-size: 0.92rem;
  white-space: nowrap;
  transition: transform 0.25s ease;
}

.project-row:hover .project-go {
  transform: translateX(4px);
}

@media (max-width: 760px) {
  .project-row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .project-meta {
    justify-content: space-between;
  }
}
</style>
