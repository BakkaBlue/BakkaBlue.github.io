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
let accent = '#8eb6ff'
let running = false
let visible = true

// spatial grid for link queries
const CELL = 90
let gridCols = 0
let gridRows = 0
const grid: number[][] = []

function densityFactor() {
  const d = preset.value.particleDensity
  if (d === 'dense') return 22000
  if (d === 'normal') return 36000
  return 56000
}

function countForSize() {
  if (!preset.value.particles) return 0
  const area = w * h
  const base = Math.floor(area / densityFactor())
  // hard caps — especially important on mobile / high-DPR
  if (preset.value.particleDensity === 'dense') return Math.max(28, Math.min(70, base))
  if (preset.value.particleDensity === 'normal') return Math.max(16, Math.min(42, base))
  return Math.max(10, Math.min(28, base))
}

function readAccent() {
  accent =
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
    '#8eb6ff'
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  // cap DPR to 1.5 to cut fill-rate cost on retina
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
  const speed =
    preset.value.particleDensity === 'dense'
      ? 0.22
      : preset.value.particleDensity === 'normal'
        ? 0.14
        : 0.1
  particles = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    r: Math.random() * (preset.value.particleDensity === 'dense' ? 1.5 : 1.1) + 0.35,
    a: Math.random() * (preset.value.particleDensity === 'dense' ? 0.36 : 0.24) + 0.08,
  }))
}

function rebuildGrid() {
  const size = gridCols * gridRows
  if (grid.length !== size) {
    grid.length = size
  }
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
  return (
    visible &&
    !reduced.value &&
    preset.value.particles &&
    !document.hidden &&
    particles.length > 0
  )
}

function step() {
  raf = 0
  if (!shouldRun()) {
    // clear once when paused
    if (ctx) ctx.clearRect(0, 0, w, h)
    running = false
    return
  }

  if (!ctx) {
    schedule()
    return
  }

  ctx.clearRect(0, 0, w, h)

  const linkDist =
    preset.value.particleDensity === 'dense'
      ? Math.min(130, w * 0.1)
      : Math.min(100, w * 0.08)
  const linkAlpha = preset.value.particleDensity === 'dense' ? 0.16 : 0.1
  const pointerOn = preset.value.particlePointer && pointer.active

  for (const p of particles) {
    if (pointerOn) {
      const dx = pointer.x - p.x
      const dy = pointer.y - p.y
      const distSq = dx * dx + dy * dy
      if (distSq < 180 * 180 && distSq > 0.01) {
        const dist = Math.sqrt(distSq)
        const force = (180 - dist) / 180
        p.vx -= (dx / dist) * force * 0.035
        p.vy -= (dy / dist) * force * 0.035
      }
    }

    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.995
    p.vy *= 0.995

    if (p.x < -10) p.x = w + 10
    else if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    else if (p.y > h + 10) p.y = -10
  }

  // draw dots in one style pass
  ctx.fillStyle = accent
  for (const p of particles) {
    ctx.globalAlpha = p.a
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  // spatial-hash links — O(n * k) instead of O(n²)
  rebuildGrid()
  ctx.strokeStyle = accent
  ctx.lineWidth = 1
  const linkDistSq = linkDist * linkDist

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
            ctx.globalAlpha = (1 - dist / linkDist) * linkAlpha
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
  if (!running) return
  if (raf) return
  raf = requestAnimationFrame(step)
}

function start() {
  if (running) return
  if (!shouldRun()) {
    if (ctx) ctx.clearRect(0, 0, w, h)
    return
  }
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

function onThemeChange() {
  readAccent()
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
let mo: MutationObserver | null = null

onMounted(() => {
  readAccent()
  resize()

  // only animate while canvas roughly on-screen (always is, but cheap)
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

  // theme / style attribute changes → refresh accent without per-frame getComputedStyle
  mo = new MutationObserver(onThemeChange)
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-style', 'class'],
  })

  start()
})

watch(
  () => [preset.value.particleDensity, preset.value.particles],
  () => {
    spawn()
    if (preset.value.particles) start()
    else stop()
  },
)

onUnmounted(() => {
  stop()
  window.clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibility)
  io?.disconnect()
  mo?.disconnect()
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
  contain: strict;
}

:global(html[data-style='max']) .particle-field {
  opacity: 0.85;
}

:global(html[data-style='glass']) .particle-field {
  opacity: 0.55;
}
</style>
