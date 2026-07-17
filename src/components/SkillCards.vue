<template>
  <section class="section">
    <div class="section-inner">
      <h2 class="section-title">技能 & 工具箱</h2>
      <div class="skills-grid">
        <div
          v-for="(skill, i) in skills"
          :key="skill.title"
          class="skill-card glass-card reveal"
          :class="'reveal-delay-' + (i + 1)"
        >
          <div class="skill-icon">{{ skill.icon }}</div>
          <h3 class="skill-title">{{ skill.title }}</h3>
          <p class="skill-desc">{{ skill.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const skills = [
  { icon: '🖥️', title: '技术栈', desc: 'Vue / TypeScript / Python / Node.js' },
  { icon: '🎨', title: '设计工具', desc: 'Figma / Blender / 偶尔玩 AI 绘图' },
  { icon: '🔧', title: '物联网', desc: 'ESP32 / Home Assistant / 智能家居瞎折腾' },
]
</script>

<style scoped>
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.skill-card {
  text-align: center;
  padding: 36px 24px;
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.skill-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.skill-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
