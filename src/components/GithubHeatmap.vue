<template>
  <section class="section page-shell">
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

interface DayCell {
  date: string
  count: number
  level: number
}

const username = 'BakkaBlue'
const CACHE_KEY = `cyan-gh-contrib-${username}-last`
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6h

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

const isLight = computed(
  () => document.documentElement.dataset.theme !== 'dark',
)

// theme-aware fallback chart color (hex without #)
const fallbackSrc = computed(() => {
  const hex = isLight.value ? '0071e3' : '0a84ff'
  return `https://ghchart.rshah.org/${hex}/${username}`
})

const CELL = 12
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

function parseHexColor(raw: string): { r: number; g: number; b: number } | null {
  const v = raw.trim()
  if (v.startsWith('#') && v.length >= 7) {
    return {
      r: parseInt(v.slice(1, 3), 16),
      g: parseInt(v.slice(3, 5), 16),
      b: parseInt(v.slice(5, 7), 16),
    }
  }
  return null
}

function mix(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

/** Build high-contrast level colors for current theme */
function levelColors(): string[] {
  const theme = document.documentElement.dataset.theme
  const light = theme !== 'dark'
  const accentRaw = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim()
  const accent = parseHexColor(accentRaw) || (light
    ? { r: 0, g: 113, b: 227 }
    : { r: 10, g: 132, b: 255 })

  if (light) {
    // GitHub-like empty cell on light surfaces + strong blue ramp
    const empty = '#ebedf0'
    const base = { r: 235, g: 237, b: 240 } // empty base to mix from
    const levels = [empty]
    const stops = [0.28, 0.48, 0.7, 1]
    for (const t of stops) {
      levels.push(
        `rgb(${mix(base.r, accent.r, t)}, ${mix(base.g, accent.g, t)}, ${mix(base.b, accent.b, t)})`,
      )
    }
    return levels
  }

  // dark: empty is visible graphite, filled uses accent opacity ramp
  return [
    'rgba(255,255,255,0.08)',
    `rgba(${accent.r},${accent.g},${accent.b},0.28)`,
    `rgba(${accent.r},${accent.g},${accent.b},0.48)`,
    `rgba(${accent.r},${accent.g},${accent.b},0.72)`,
    `rgba(${accent.r},${accent.g},${accent.b},0.95)`,
  ]
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

  const colors = levelColors()
  const light = document.documentElement.dataset.theme !== 'dark'

  for (let i = 0; i < cells.value.length; i++) {
    const week = (i / 7) | 0
    const day = i % 7
    const level = Math.min(4, Math.max(0, cells.value[i].level))
    const x = week * (CELL + GAP)
    const y = day * (CELL + GAP)

    ctx.fillStyle = colors[level]
    const rr = 2
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + CELL, y, x + CELL, y + CELL, rr)
    ctx.arcTo(x + CELL, y + CELL, x, y + CELL, rr)
    ctx.arcTo(x, y + CELL, x, y, rr)
    ctx.arcTo(x, y, x + CELL, y, rr)
    ctx.closePath()
    ctx.fill()

    // subtle edge so empty cells stay readable on white cards
    if (light && level === 0) {
      ctx.strokeStyle = 'rgba(27, 31, 35, 0.06)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
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

let themeObs: MutationObserver | null = null

onMounted(() => {
  // page-level: load immediately
  activated.value = true
  load()

  // repaint when day/night theme changes
  themeObs = new MutationObserver(() => {
    if (cells.value.length) paint()
  })
  themeObs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
})

onUnmounted(() => {
  themeObs?.disconnect()
  themeObs = null
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
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
  box-sizing: border-box;
}

/* dark defaults */
.lv-0 { background: rgba(255, 255, 255, 0.08); }
.lv-1 { background: color-mix(in srgb, var(--accent) 28%, transparent); }
.lv-2 { background: color-mix(in srgb, var(--accent) 48%, transparent); }
.lv-3 { background: color-mix(in srgb, var(--accent) 72%, transparent); }
.lv-4 { background: color-mix(in srgb, var(--accent) 95%, white 5%); }

/* light: GitHub-like empty + solid blue ramp */
:global(html[data-theme='light']) .lv-0 {
  background: #ebedf0;
  box-shadow: inset 0 0 0 1px rgba(27, 31, 35, 0.06);
}
:global(html[data-theme='light']) .lv-1 {
  background: color-mix(in srgb, var(--accent) 32%, #ebedf0);
}
:global(html[data-theme='light']) .lv-2 {
  background: color-mix(in srgb, var(--accent) 52%, #ebedf0);
}
:global(html[data-theme='light']) .lv-3 {
  background: color-mix(in srgb, var(--accent) 74%, #ebedf0);
}
:global(html[data-theme='light']) .lv-4 {
  background: var(--accent);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 0.75rem;
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
