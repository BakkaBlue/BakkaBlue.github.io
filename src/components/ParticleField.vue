<template>
  <canvas ref="canvasRef" class="particle-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { useStylePreset } from '@/composables/useStylePreset'
import { usePointer } from '@/composables/usePointer'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { reduced } = usePrefersReducedMotion()
const { preset } = useStylePreset()
const pointer = usePointer()

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let raf = 0
let w = 0
let h = 0
let dpr = 1

function densityFactor() {
  const d = preset.value.particleDensity
  if (d === 'dense') return 14000
  if (d === 'normal') return 26000
  return 42000
}

function countForSize() {
  if (!preset.value.particles) return 0
  const area = w * h
  const base = Math.floor(area / densityFactor())
  if (preset.value.particleDensity === 'dense') return Math.max(50, Math.min(140, base))
  if (preset.value.particleDensity === 'normal') return Math.max(28, Math.min(70, base))
  return Math.max(16, Math.min(42, base))
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  spawn()
}

function spawn() {
  const n = countForSize()
  const speed =
    preset.value.particleDensity === 'dense'
      ? 0.28
      : preset.value.particleDensity === 'normal'
        ? 0.16
        : 0.12
  particles = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    r:
      Math.random() *
        (preset.value.particleDensity === 'dense' ? 1.8 : 1.2) +
      0.4,
    a:
      Math.random() *
        (preset.value.particleDensity === 'dense' ? 0.42 : 0.28) +
      0.08,
  }))
}

function step() {
  if (!ctx) {
    raf = requestAnimationFrame(step)
    return
  }

  ctx.clearRect(0, 0, w, h)
  if (reduced.value || !preset.value.particles) {
    raf = requestAnimationFrame(step)
    return
  }

  const accent =
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
    '#8eb6ff'
  const linkDist =
    preset.value.particleDensity === 'dense'
      ? Math.min(170, w * 0.13)
      : Math.min(120, w * 0.09)

  for (const p of particles) {
    if (preset.value.particlePointer && pointer.active) {
      const dx = pointer.x - p.x
      const dy = pointer.y - p.y
      const dist = Math.hypot(dx, dy) || 1
      if (dist < 180) {
        const force = (180 - dist) / 180
        p.vx -= (dx / dist) * force * 0.04
        p.vy -= (dy / dist) * force * 0.04
      }
    }

    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.995
    p.vy *= 0.995

    if (p.x < -10) p.x = w + 10
    if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    if (p.y > h + 10) p.y = -10

    ctx.beginPath()
    ctx.fillStyle = accent
    ctx.globalAlpha = p.a
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.hypot(dx, dy)
      if (dist < linkDist) {
        ctx.strokeStyle = accent
        ctx.globalAlpha =
          (1 - dist / linkDist) *
          (preset.value.particleDensity === 'dense' ? 0.22 : 0.12)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 1
  raf = requestAnimationFrame(step)
}

watch(
  () => [preset.value.particleDensity, preset.value.particles],
  () => spawn(),
)

onMounted(() => {
  resize()
  window.addEventListener('resize', resize, { passive: true })
  raf = requestAnimationFrame(step)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.particle-field {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.7;
}

:global(html[data-style='max']) .particle-field {
  opacity: 0.9;
}

:global(html[data-style='glass']) .particle-field {
  opacity: 0.55;
}
</style>
