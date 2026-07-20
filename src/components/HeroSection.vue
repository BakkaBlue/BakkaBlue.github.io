<template>
  <section class="home page-shell">
    <div class="hero card">
      <p class="eyebrow">Personal site</p>
      <h1>你好，我是 <span>Cyan</span></h1>
      <p class="lead">
        半吊子全栈 · AI 重度依赖者 · 野生硬件玩家。
        这里放我的项目、笔记和一点点在线状态。
      </p>
      <div class="actions">
        <a class="btn" href="/projects" @click.prevent="goProjects">查看项目</a>
        <a class="btn-secondary" href="/blog" @click.prevent="goBlog">阅读博客</a>
      </div>
    </div>

    <div class="quick-grid">
      <a v-for="item in quick" :key="item.path" class="card quick" :href="item.path" @click.prevent="go(item.path)">
        <span class="q-label">{{ item.label }}</span>
        <strong>{{ item.title }}</strong>
        <span class="q-go">打开 →</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAppRoute } from '@/composables/useAppRoute'

const { go, goProjects, goBlog } = useAppRoute()

const quick = [
  { path: '/skills', label: 'Skills', title: '技能与工具' },
  { path: '/github', label: 'GitHub', title: '贡献热力图' },
  { path: '/projects', label: 'Projects', title: '可玩项目' },
  { path: '/contact', label: 'Contact', title: '找到我' },
]
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 8px;
}

.hero {
  padding: 36px 32px;
}

.eyebrow {
  color: var(--accent);
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 12px;
}

h1 {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  letter-spacing: -0.045em;
  line-height: 1.05;
  font-weight: 700;
  margin-bottom: 14px;
}

h1 span {
  color: var(--accent);
}

.lead {
  max-width: 36rem;
  color: var(--text-secondary);
  font-size: 1.12rem;
  line-height: 1.55;
  margin-bottom: 22px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.quick {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  min-height: 130px;
  color: inherit;
}

.quick:hover {
  transform: translateY(-2px);
}

.q-label {
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.quick strong {
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.q-go {
  margin-top: auto;
  color: var(--accent);
  font-size: 0.9rem;
}

@media (max-width: 960px) {
  .quick-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .hero {
    padding: 26px 20px;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
