<template>
  <section id="skills" class="section">
    <div class="section-inner">
      <header class="section-header">
        <p class="section-kicker">Capabilities</p>
        <h2 class="section-title">技能与工具箱</h2>
        <p class="section-desc">少而精的主线，而不是堆满标签的工具墙。</p>
      </header>

      <div class="skills-grid">
        <article
          v-for="(skill, i) in skills"
          :key="skill.title"
          class="skill-card glass-card reveal"
          :class="'reveal-delay-' + (i + 1)"
        >
          <div class="skill-top">
            <span class="skill-index">0{{ i + 1 }}</span>
            <span class="skill-icon" aria-hidden="true">{{ skill.icon }}</span>
          </div>
          <h3 class="skill-title">{{ skill.title }}</h3>
          <p class="skill-desc">{{ skill.desc }}</p>
          <div class="skill-tags">
            <span v-for="tag in skill.tags" :key="tag" class="skill-tag">{{ tag }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const skills = [
  {
    icon: '⌘',
    title: '技术栈',
    desc: '偏前端与全栈交付，把想法快速变成可交互产品。',
    tags: ['Vue', 'TypeScript', 'Python', 'Node.js'],
  },
  {
    icon: '◇',
    title: '设计表达',
    desc: '关注层级、留白与质感，让界面看起来克制而完整。',
    tags: ['Figma', 'Blender', 'AI 绘图'],
  },
  {
    icon: '◎',
    title: '物联网',
    desc: '软硬结合的小实验：传感器、自动化与智能家居。',
    tags: ['ESP32', 'Home Assistant', '硬件折腾'],
  },
]
</script>

<style scoped>
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.skill-card {
  padding: 28px 26px 30px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.skill-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.skill-index {
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  color: var(--text-muted);
}

.skill-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--glass-border);
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.95rem;
}

.skill-title {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.skill-desc {
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.7;
  margin-bottom: 22px;
  flex: 1;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  font-size: 0.78rem;
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  padding: 5px 10px;
  letter-spacing: 0.02em;
}

@media (max-width: 900px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-card {
    min-height: auto;
  }
}
</style>
