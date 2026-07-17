<template>
  <section class="section">
    <div class="section-inner">
      <h2 class="section-title">我的小项目</h2>
      <div class="projects-grid">
        <div
          v-for="(project, i) in projects"
          :key="project.title"
          class="project-card glass-card reveal"
          :class="'reveal-delay-' + (i + 1)"
        >
          <div class="project-icon">{{ project.icon }}</div>
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-desc">{{ project.desc }}</p>
          <a :href="project.link" class="project-link glass-btn">
            {{ project.linkText }}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const projects = [
  {
    icon: '⚔️',
    title: 'Idle Realms · 放置王国',
    desc: '基于时间累积的多技能放置类 RPG',
    link: 'idle_realms/',
    linkText: '进入游戏',
  },
  {
    icon: '🎨',
    title: 'Color Wordle',
    desc: '每日颜色猜词挑战，考验你的色感',
    link: 'color_wordle/',
    linkText: '开始挑战',
  },
  {
    icon: '🎵',
    title: 'Laohei Music',
    desc: '统一音乐播放页，听听老黑的歌',
    link: 'laohei-music/',
    linkText: '听歌去',
  },
]
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.project-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 36px 28px;
}

.project-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.project-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.project-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
  flex: 1;
}

.project-link {
  align-self: stretch;
  justify-content: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
