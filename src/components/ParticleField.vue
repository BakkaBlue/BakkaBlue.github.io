<template>
  <canvas ref="canvasRef" class="particle-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

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

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let raf = 0
let w = 0
let h = 0
let dpr = 1

function countForSize() {
  const area = w * h
  // sparse, elegant density
  return Math.max(18, Math.min(42, Math.floor(area / 42000)))
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
  particles = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    r: Math.random() * 1.2 + 0.4,
    a: Math.random() * 0.28 + 0.08,
  }))
}

function step() {
  if (!ctx) {
    raf = requestAnimationFrame(step)
    return
  }

  ctx.clearRect(0, 0, w, h)
  if (reduced.value) {
    raf = requestAnimationFrame(step)
    return
  }

  const accent =
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
    '#8eb6ff'
  const linkDist = Math.min(120, w * 0.09)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
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
        ctx.globalAlpha = (1 - dist / linkDist) * 0.12
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
</style>
