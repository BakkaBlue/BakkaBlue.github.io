<template>
  <canvas ref="canvasRef" class="particle-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { usePointer } from '@/composables/usePointer'
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
const pointer = usePointer()
const { reduced } = usePrefersReducedMotion()

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let raf = 0
let w = 0
let h = 0
let dpr = 1

function countForSize() {
  const area = w * h
  return Math.max(40, Math.min(120, Math.floor(area / 18000)))
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
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.6,
    a: Math.random() * 0.45 + 0.15,
  }))
}

function step() {
  if (!ctx || reduced.value) {
    raf = requestAnimationFrame(step)
    return
  }

  ctx.clearRect(0, 0, w, h)

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6'
  const linkDist = Math.min(160, w * 0.12)

  for (const p of particles) {
    // cursor gravity / repulsion soft field
    if (pointer.active) {
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

    if (p.x < -20) p.x = w + 20
    if (p.x > w + 20) p.x = -20
    if (p.y < -20) p.y = h + 20
    if (p.y > h + 20) p.y = -20

    ctx.beginPath()
    ctx.fillStyle = accent
    ctx.globalAlpha = p.a
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  // constellation links
  ctx.globalAlpha = 1
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.hypot(dx, dy)
      if (dist < linkDist) {
        ctx.strokeStyle = accent
        ctx.globalAlpha = (1 - dist / linkDist) * 0.25
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
}
</style>
