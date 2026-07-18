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
let accent = 'rgba(200,200,208,0.9)'
let running = false
let visible = true

const CELL = 100
let gridCols = 0
let gridRows = 0
const grid: number[][] = []

function countForSize() {
  const area = w * h
  return Math.max(10, Math.min(26, Math.floor(area / 56000)))
}

function readAccent() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  accent = raw || 'rgba(200,200,208,0.9)'
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  gridCols = Math.ceil(w / CELL) + 1
  gridRows = Math.ceil(h / CELL) + 1
  spawn()
}

function spawn() {
  const n = countForSize()
  particles = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.1,
    r: Math.random() * 1.0 + 0.35,
    a: Math.random() * 0.22 + 0.06,
  }))
}

function rebuildGrid() {
  const size = gridCols * gridRows
  if (grid.length !== size) grid.length = size
  for (let i = 0; i < size; i++) {
    if (grid[i]) grid[i].length = 0
    else grid[i] = []
  }
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const cx = Math.min(gridCols - 1, Math.max(0, (p.x / CELL) | 0))
    const cy = Math.min(gridRows - 1, Math.max(0, (p.y / CELL) | 0))
    grid[cy * gridCols + cx].push(i)
  }
}

function shouldRun() {
  return visible && !reduced.value && !document.hidden && particles.length > 0
}

function step() {
  raf = 0
  if (!shouldRun()) {
    if (ctx) ctx.clearRect(0, 0, w, h)
    running = false
    return
  }
  if (!ctx) {
    schedule()
    return
  }

  ctx.clearRect(0, 0, w, h)
  const linkDist = Math.min(96, w * 0.08)
  const linkDistSq = linkDist * linkDist

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < -10) p.x = w + 10
    else if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    else if (p.y > h + 10) p.y = -10
  }

  ctx.fillStyle = accent
  for (const p of particles) {
    ctx.globalAlpha = p.a
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  rebuildGrid()
  ctx.strokeStyle = accent
  ctx.lineWidth = 1
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]
    const cx = Math.min(gridCols - 1, Math.max(0, (a.x / CELL) | 0))
    const cy = Math.min(gridRows - 1, Math.max(0, (a.y / CELL) | 0))
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const nx = cx + ox
        const ny = cy + oy
        if (nx < 0 || ny < 0 || nx >= gridCols || ny >= gridRows) continue
        const bucket = grid[ny * gridCols + nx]
        for (let k = 0; k < bucket.length; k++) {
          const j = bucket[k]
          if (j <= i) continue
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq < linkDistSq) {
            const dist = Math.sqrt(distSq)
            ctx.globalAlpha = (1 - dist / linkDist) * 0.1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }
  }
  ctx.globalAlpha = 1
  schedule()
}

function schedule() {
  if (!running || raf) return
  raf = requestAnimationFrame(step)
}

function start() {
  if (running || !shouldRun()) return
  running = true
  schedule()
}

function stop() {
  running = false
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
  if (ctx) ctx.clearRect(0, 0, w, h)
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

let resizeTimer = 0
function onResize() {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    resize()
    start()
  }, 120)
}

let io: IntersectionObserver | null = null

onMounted(() => {
  readAccent()
  resize()
  io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting)
      if (visible) start()
      else stop()
    },
    { threshold: 0 },
  )
  if (canvasRef.value) io.observe(canvasRef.value)
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  start()
})

onUnmounted(() => {
  stop()
  window.clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibility)
  io?.disconnect()
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
  opacity: 0.38;
  contain: strict;
}
</style>
