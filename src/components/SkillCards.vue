<template>
  <section id="skills" class="section">
    <div class="section-inner">
      <h2 class="section-title glitch-title" data-text="技能 & 工具箱">技能 & 工具箱</h2>
      <div class="skills-grid">
        <div
          v-for="(skill, i) in skills"
          :key="skill.title"
          class="skill-card glass-card reveal tilt-card"
          :class="'reveal-delay-' + (i + 1)"
          :ref="(el) => setCardRef(el, i)"
          :style="styles[i]"
        >
          <div class="card-spotlight" aria-hidden="true"></div>
          <div class="skill-icon">{{ skill.icon }}</div>
          <h3 class="skill-title">{{ skill.title }}</h3>
          <p class="skill-desc">{{ skill.desc }}</p>
          <div class="skill-meter" aria-hidden="true">
            <span class="skill-meter__fill" :style="{ width: skill.level + '%' }"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type ComponentPublicInstance } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const skills = [
  { icon: '🖥️', title: '技术栈', desc: 'Vue / TypeScript / Python / Node.js', level: 86 },
  { icon: '🎨', title: '设计工具', desc: 'Figma / Blender / 偶尔玩 AI 绘图', level: 72 },
  { icon: '🔧', title: '物联网', desc: 'ESP32 / Home Assistant / 智能家居瞎折腾', level: 78 },
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
    const rx = (0.5 - py) * 12
    const ry = (px - 0.5) * 12
    styles.value[i] = {
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`,
      '--mx': `${px * 100}%`,
      '--my': `${py * 100}%`,
    }
  }
  const onLeave = () => {
    styles.value[i] = {
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)',
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
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.skill-card {
  position: relative;
  text-align: center;
  padding: 36px 24px;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}

.card-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    280px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.14),
    transparent 50%
  );
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 12px var(--accent-glow));
}

.skill-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.skill-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.skill-meter {
  margin-top: 20px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.skill-meter__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  box-shadow: 0 0 12px var(--accent-glow);
  transform-origin: left center;
  animation: meter-in 1.2s ease both;
}

@keyframes meter-in {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
