<template>
  <section id="github" class="section">
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

      <div class="heatmap-panel glass-card reveal">
        <div v-if="loading" class="heatmap-state">正在加载贡献数据…</div>

        <div v-else-if="error && !useFallback" class="heatmap-state">
          暂时无法拉取热力图，
          <button class="retry" type="button" @click="load">重试</button>
        </div>

        <div v-else-if="useFallback" class="heatmap-fallback">
          <img
            :src="fallbackSrc"
            :alt="`${username} GitHub contributions`"
            loading="lazy"
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
            <div class="heatmap-grid" :style="gridStyle">
              <div
                v-for="cell in cells"
                :key="cell.date"
                class="cell"
                :class="'lv-' + cell.level"
                :title="tooltip(cell)"
              ></div>
            </div>
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
import { computed, nextTick, onMounted, ref } from 'vue'

interface DayCell {
  date: string
  count: number
  level: number
}

const username = 'BakkaBlue'
const loading = ref(true)
const error = ref(false)
const useFallback = ref(false)
const cells = ref<DayCell[]>([])
const totalContributions = ref(0)
const activeDays = ref(0)
const maxStreak = ref(0)
const scrollRef = ref<HTMLElement | null>(null)

const weeks = computed(() => Math.max(1, Math.ceil(cells.value.length / 7)))
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${weeks.value}, 11px)`,
}))

const fallbackSrc = computed(
  () => `https://ghchart.rshah.org/8eb6ff/${username}`,
)

function tooltip(cell: DayCell) {
  const label = cell.count === 1 ? 'contribution' : 'contributions'
  return `${cell.count} ${label} on ${cell.date}`
}

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

async function load() {
  loading.value = true
  error.value = false
  useFallback.value = false

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
        typeof d.level === 'number' ? Math.min(4, Math.max(0, d.level)) : levelFromCount(d.count ?? 0),
    }))

    if (!mapped.length) throw new Error('empty contributions')

    cells.value = mapped
    totalContributions.value = mapped.reduce((sum, d) => sum + d.count, 0)
    activeDays.value = mapped.filter((d) => d.count > 0).length
    maxStreak.value = computeStreak(mapped)
    loading.value = false

    await nextTick()
    if (scrollRef.value) {
      scrollRef.value.scrollLeft = scrollRef.value.scrollWidth
    }
  } catch {
    // graceful fallback to public SVG chart
    useFallback.value = true
    error.value = true
    loading.value = false
  }
}

onMounted(load)
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
  color: var(--text-secondary);
  font-size: 0.92rem;
  white-space: nowrap;
  border-bottom: 1px solid transparent;
  transition: color 0.25s ease, border-color 0.25s ease;
}

.heatmap-profile:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-primary) 30%, transparent);
}

.heatmap-panel {
  padding: 28px 24px 22px;
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

.heatmap-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 11px);
  gap: 3px;
  width: max-content;
  min-height: 95px;
  padding: 2px 4px 6px;
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
.lv-4 {
  background: color-mix(in srgb, var(--accent) 88%, white 8%);
  box-shadow: 0 0 10px color-mix(in srgb, var(--accent-glow) 70%, transparent);
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
  filter: saturate(0.9) contrast(1.05);
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
