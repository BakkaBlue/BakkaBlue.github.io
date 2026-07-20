<template>
  <section class="section page-shell" ref="sectionRef">
    <div class="section-inner">
      <header class="section-header heatmap-header">
        <div>
          <p class="section-kicker">GitHub</p>
          <h2 class="section-title">贡献热力图</h2>
          <p class="section-desc">@{{ username }} · 最近一年的提交节奏</p>
        </div>
        <a
          class="heatmap-profile"
          :href="`https://github.com/${username}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          打开 GitHub →
        </a>
      </header>

      <div class="heatmap-panel card reveal visible">
        <div v-if="!activated || loading" class="heatmap-state">
          {{ activated ? '正在加载贡献数据…' : '准备加载…' }}
        </div>

        <div v-else-if="error && !useFallback" class="heatmap-state">
          暂时无法拉取热力图，
          <button class="retry" type="button" @click="load">重试</button>
        </div>

        <div v-else-if="useFallback" class="heatmap-fallback">
          <img
            :src="fallbackSrc"
            :alt="`${username} GitHub contributions`"
            loading="lazy"
            decoding="async"
            class="fallback-img"
          />
        </div>

        <template v-else>
          <div class="heatmap-meta">
            <div class="meta-item">
              <span class="meta-value">{{ totalContributions.toLocaleString() }}</span>
              <span class="meta-label">contributions</span>
            </div>
            <div class="meta-item">
              <span class="meta-value">{{ activeDays }}</span>
              <span class="meta-label">active days</span>
            </div>
            <div class="meta-item">
              <span class="meta-value">{{ maxStreak }}</span>
              <span class="meta-label">best streak</span>
            </div>
          </div>

          <div class="heatmap-scroll" ref="scrollRef">
            <canvas
              ref="canvasRef"
              class="heatmap-canvas"
              role="img"
              :aria-label="`${totalContributions} contributions in the last year`"
            ></canvas>
          </div>

          <div class="heatmap-legend">
            <span>Less</span>
            <i class="cell lv-0"></i>
            <i class="cell lv-1"></i>
            <i class="cell lv-2"></i>
            <i class="cell lv-3"></i>
            <i class="cell lv-4"></i>
            <span>More</span>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

interface DayCell {
  date: string
  count: number
  level: number
}

const username = 'BakkaBlue'
const CACHE_KEY = `cyan-gh-contrib-${username}-last`
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6h

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

const activated = ref(false)
const loading = ref(false)
const error = ref(false)
const useFallback = ref(false)
const cells = ref<DayCell[]>([])
const totalContributions = ref(0)
const activeDays = ref(0)
const maxStreak = ref(0)

const fallbackSrc = `https://ghchart.rshah.org/c8c8d0/${username}`

const CELL = 11
const GAP = 3

function levelFromCount(count: number) {
  if (count <= 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

function computeStreak(days: DayCell[]) {
  let best = 0
  let current = 0
  for (const d of days) {
    if (d.count > 0) {
      current += 1
      best = Math.max(best, current)
    } else {
      current = 0
    }
  }
  return best
}

function readCache(): DayCell[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { t: number; cells: DayCell[] }
    if (Date.now() - parsed.t > CACHE_TTL) return null
    return parsed.cells
  } catch {
    return null
  }
}

function writeCache(list: DayCell[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), cells: list }))
  } catch {
    /* ignore quota */
  }
}

function parseAccent(): { r: number; g: number; b: number } {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  // #rrggbb
  if (raw.startsWith('#') && raw.length >= 7) {
    return {
      r: parseInt(raw.slice(1, 3), 16),
      g: parseInt(raw.slice(3, 5), 16),
      b: parseInt(raw.slice(5, 7), 16),
    }
  }
  return { r: 200, g: 200, b: 208 }
}

function paint() {
  const canvas = canvasRef.value
  if (!canvas || !cells.value.length) return

  const weeks = Math.ceil(cells.value.length / 7)
  const cssW = weeks * (CELL + GAP) - GAP
  const cssH = 7 * (CELL + GAP) - GAP
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.floor(cssW * dpr)
  canvas.height = Math.floor(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  const { r, g, b } = parseAccent()
  const alphas = [0.045, 0.22, 0.4, 0.62, 0.88]

  // data is typically chronological Mon-Sun columns
  for (let i = 0; i < cells.value.length; i++) {
    const week = (i / 7) | 0
    const day = i % 7
    const level = cells.value[i].level
    const x = week * (CELL + GAP)
    const y = day * (CELL + GAP)
    if (level <= 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.045)'
    } else {
      ctx.fillStyle = `rgba(${r},${g},${b},${alphas[level]})`
    }
    // rounded rect-ish via path for small cost, or simple rect
    ctx.beginPath()
    const rr = 2
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + CELL, y, x + CELL, y + CELL, rr)
    ctx.arcTo(x + CELL, y + CELL, x, y + CELL, rr)
    ctx.arcTo(x, y + CELL, x, y, rr)
    ctx.arcTo(x, y, x + CELL, y, rr)
    ctx.closePath()
    ctx.fill()
  }
}

function applyCells(mapped: DayCell[]) {
  cells.value = mapped
  totalContributions.value = mapped.reduce((sum, d) => sum + d.count, 0)
  activeDays.value = mapped.filter((d) => d.count > 0).length
  maxStreak.value = computeStreak(mapped)
}

async function load() {
  loading.value = true
  error.value = false
  useFallback.value = false

  const cached = readCache()
  if (cached?.length) {
    applyCells(cached)
    loading.value = false
    await nextTick()
    paint()
    if (scrollRef.value) scrollRef.value.scrollLeft = scrollRef.value.scrollWidth
    // still refresh in background
  }

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { headers: { Accept: 'application/json' } },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    const contributions = (data.contributions ?? []) as Array<{
      date: string
      count: number
      level?: number
    }>

    const mapped: DayCell[] = contributions.map((d) => ({
      date: d.date,
      count: d.count ?? 0,
      level:
        typeof d.level === 'number'
          ? Math.min(4, Math.max(0, d.level))
          : levelFromCount(d.count ?? 0),
    }))

    if (!mapped.length) throw new Error('empty contributions')

    applyCells(mapped)
    writeCache(mapped)
    loading.value = false
    await nextTick()
    paint()
    if (scrollRef.value) scrollRef.value.scrollLeft = scrollRef.value.scrollWidth
  } catch {
    if (!cells.value.length) {
      useFallback.value = true
      error.value = true
    }
    loading.value = false
  }
}

let io: IntersectionObserver | null = null

onMounted(() => {
  // page-level: load immediately
  activated.value = true
  load()
})

onUnmounted(() => {
  io?.disconnect()
})
</script>

<style scoped>
.heatmap-header {
  width: 100%;
  max-width: none;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.heatmap-profile {
  color: var(--accent);
  font-size: 0.92rem;
  white-space: nowrap;
}

.heatmap-panel {
  padding: 22px;
  overflow: hidden;
}

.heatmap-state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.retry {
  margin-left: 6px;
  border: none;
  background: none;
  color: var(--accent);
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.heatmap-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-bottom: 22px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-value {
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.meta-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.heatmap-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  margin: 0 -4px;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--accent) 30%, transparent) transparent;
}

.heatmap-canvas {
  display: block;
  min-height: 95px;
  margin: 2px 4px 6px;
}

.cell {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.lv-1 { background: color-mix(in srgb, var(--accent) 22%, rgba(255,255,255,0.04)); }
.lv-2 { background: color-mix(in srgb, var(--accent) 40%, rgba(255,255,255,0.04)); }
.lv-3 { background: color-mix(in srgb, var(--accent) 62%, rgba(255,255,255,0.04)); }
.lv-4 { background: color-mix(in srgb, var(--accent) 88%, white 8%); }

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.heatmap-legend .cell {
  display: inline-block;
}

.heatmap-fallback {
  display: flex;
  justify-content: center;
  padding: 8px 0 4px;
}

.fallback-img {
  width: min(100%, 820px);
  height: auto;
  opacity: 0.95;
}

@media (max-width: 720px) {
  .heatmap-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .heatmap-panel {
    padding: 22px 16px 18px;
  }

  .heatmap-meta {
    gap: 18px;
  }
}
</style>
