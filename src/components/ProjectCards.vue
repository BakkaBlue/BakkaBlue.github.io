<template>
  <section id="projects" class="section">
    <div class="section-inner">
      <h2 class="section-title glitch-title" data-text="我的小项目">我的小项目</h2>
      <div class="projects-grid">
        <a
          v-for="(project, i) in projects"
          :key="project.title"
          :href="project.link"
          class="project-card glass-card reveal"
          :class="'reveal-delay-' + (i + 1)"
          :ref="(el) => setCardRef(el, i)"
          :style="styles[i]"
        >
          <div class="card-spotlight" aria-hidden="true"></div>
          <div class="project-icon">{{ project.icon }}</div>
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-desc">{{ project.desc }}</p>
          <span class="project-link glass-btn">
            {{ project.linkText }}
            <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type ComponentPublicInstance } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

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

const cardEls = ref<Array<HTMLElement | null>>([])
const styles = ref<Array<Record<string, string>>>([])
const { reduced } = usePrefersReducedMotion()
const cleanups: Array<() => void> = []

function setCardRef(el: Element | ComponentPublicInstance | null, i: number) {
  if (!el) return
  cardEls.value[i] = el as HTMLElement
  if (!styles.value[i]) {
    styles.value[i] = {
      transform: 'perspective(900px) rotateX(0) rotateY(0)',
      '--mx': '50%',
      '--my': '50%',
    }
  }
}

function bindTilt(el: HTMLElement, i: number) {
  const onMove = (e: PointerEvent) => {
    if (reduced.value) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * 14
    const ry = (px - 0.5) * 14
    styles.value[i] = {
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`,
      '--mx': `${px * 100}%`,
      '--my': `${py * 100}%`,
    }
  }
  const onLeave = () => {
    styles.value[i] = {
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
      '--mx': '50%',
      '--my': '50%',
    }
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  cleanups.push(() => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  })
}

onMounted(() => {
  cardEls.value.forEach((el, i) => {
    if (el) bindTilt(el, i)
  })
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
})
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
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  text-decoration: none;
  color: inherit;
}

.card-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    320px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.16),
    transparent 50%
  );
}

.project-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 14px var(--accent-glow));
  transition: transform 0.3s ease;
}

.project-card:hover .project-icon {
  transform: scale(1.12) rotate(-6deg);
}

.project-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.project-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
  flex: 1;
  position: relative;
  z-index: 1;
}

.project-link {
  align-self: stretch;
  justify-content: center;
  font-weight: 500;
  position: relative;
  z-index: 1;
  pointer-events: none;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
