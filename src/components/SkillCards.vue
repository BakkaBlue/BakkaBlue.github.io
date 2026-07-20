<template>
  <section class="section page-shell">
    <header class="section-header">
      <p class="section-kicker">Skills</p>
      <h2 class="section-title">技能与工具</h2>
      <p class="section-desc">少而精的主线，而不是堆满标签的工具墙。</p>
    </header>

    <div class="grid">
      <article v-for="(skill, i) in skills" :key="skill.title" class="card item reveal" :class="'reveal-delay-' + (i + 1)">
        <div class="top">
          <span class="idx">0{{ i + 1 }}</span>
          <span class="ico">{{ skill.icon }}</span>
        </div>
        <h3>{{ skill.title }}</h3>
        <p>{{ skill.desc }}</p>
        <div class="tags">
          <span v-for="tag in skill.tags" :key="tag">{{ tag }}</span>
        </div>
      </article>
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
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.item {
  padding: 22px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
}

.item:hover {
  transform: translateY(-2px);
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.idx {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--accent-soft);
  color: var(--accent);
}

h3 {
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

p {
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  font-size: 0.78rem;
  color: var(--text-muted);
  background: var(--bg-soft);
  border-radius: 999px;
  padding: 5px 10px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
