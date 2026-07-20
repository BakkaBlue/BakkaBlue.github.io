<template>
  <section class="home page-shell">
    <div class="hero-layout">
      <div class="copy card">
        <p class="eyebrow">Personal site</p>
        <h1>你好，我是 <span>Cyan</span></h1>
        <p class="lead">
          半吊子全栈 · AI 重度依赖者 · 野生硬件玩家。
          右侧是悬浮在背景里的终端队列：打完就落下，下一扇补上。
        </p>
        <div class="actions">
          <a class="btn" href="/projects" @click.prevent="goProjects">查看项目</a>
          <a class="btn-secondary" href="/blog" @click.prevent="goBlog">阅读博客</a>
        </div>
      </div>

      <!-- open stage: no card chrome, terminals float above ambient bg -->
      <div class="queue-slot">
        <TerminalQueue />
      </div>
    </div>

    <div class="quick-grid">
      <a
        v-for="item in quick"
        :key="item.path"
        class="card quick"
        :href="item.path"
        @click.prevent="go(item.path)"
      >
        <span class="q-label">{{ item.label }}</span>
        <strong>{{ item.title }}</strong>
        <span class="q-go">打开 →</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import TerminalQueue from './TerminalQueue.vue'
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

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(320px, 1.12fr);
  gap: 8px 20px;
  align-items: center;
}

.copy {
  position: relative;
  z-index: 2;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.eyebrow {
  color: var(--accent);
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 12px;
}

h1 {
  font-size: clamp(2rem, 4.5vw, 3.1rem);
  letter-spacing: -0.045em;
  line-height: 1.05;
  font-weight: 700;
  margin-bottom: 14px;
}

h1 span {
  color: var(--accent);
}

.lead {
  max-width: 34rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.55;
  margin-bottom: 22px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.queue-slot {
  position: relative;
  z-index: 1;
  min-height: 520px;
  margin-right: -12px;
  /* let terminals breathe into surrounding space */
  overflow: visible;
}

.quick-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.quick {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  min-height: 120px;
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

@media (max-width: 980px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }

  .queue-slot {
    min-height: 460px;
    margin-right: 0;
  }

  .quick-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .copy {
    padding: 24px 18px;
  }

  .queue-slot {
    min-height: 380px;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
