<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { gameState } from '@/engine/state/GameState'
import { PLOT_TYPES, FARM_CROPS, getCropsByCategory, type PlotCategory } from '@/data/farming'
import { useI18n } from 'vue-i18n'
import { xpForLevel } from '@/engine/systems/ExperienceSystem'
const { t } = useI18n()
import {
  buyPlot, upgradePlot, assignCrop, unassignCrop, toggleCropSelection,
  getBuyPlotCost, getUpgradePlotCost, getPlotSpeedMult,
} from '@/engine/systems/FarmingSystem'

const s = computed(() => gameState.skills.farming)
const xpNext = computed(() => xpForLevel(s.value.level))
const xpPct = computed(() => xpNext.value > 0 ? (s.value.xp / xpNext.value) * 100 : 0)

// 每秒刷新 UI 以更新生长倒计时
const tick = ref(0)
const timer = setInterval(() => tick.value++, 1000)
onUnmounted(() => clearInterval(timer))

function getPlotActualTime(cropId: string, plotLevel: number): number {
  const crop = FARM_CROPS[cropId]
  if (!crop) return 0
  return crop.growTime / getPlotSpeedMult(plotLevel)
}

function getPlotProgress(plot: { cropId: string | null; progress: number; level: number }): number {
  if (!plot.cropId) return 0
  const actual = getPlotActualTime(plot.cropId, plot.level)
  return actual > 0 ? Math.min(100, (plot.progress / actual) * 100) : 0
}

function getPlotRemaining(plot: { cropId: string | null; progress: number; level: number }): number {
  if (!plot.cropId) return 0
  const actual = getPlotActualTime(plot.cropId, plot.level)
  return Math.max(0, Math.ceil((actual - plot.progress) / 1000))
}
</script>

<template>
  <div class="farming-view">
    <div class="page-header">
      <div class="page-title">{{ t('ui.pages.farming.title') }}</div>
      <div class="page-sub">{{ t('ui.pages.farming.sub') }}</div>
    </div>

    <!-- 技能总览 -->
    <div class="skill-overview">
      <div class="skill-icon-big"><i class="fa-solid fa-seedling"></i></div>
      <div class="skill-info">
        <div class="skill-name">{{ t('skills.farming') }} <span style="color:var(--text-dim);font-size:14px">Lv.{{ s.level }}</span></div>
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: xpPct + '%', background: 'linear-gradient(90deg, #558b2f, #8bc34a)' }"></div>
          <div class="xp-text">{{ s.xp }} / {{ xpNext }}</div>
        </div>
      </div>
    </div>

    <!-- 按类别渲染地块 -->
    <div v-for="cat in (Object.keys(PLOT_TYPES) as PlotCategory[])" :key="cat" class="farm-category">
      <div class="category-header">
        <div class="category-icon" :style="{ background: `rgba(${cat==='veg'?'139,195,74':cat==='herb'?'185,104,224':'161,136,127'},0.2)`, color: PLOT_TYPES[cat].color }">
          <i class="fa-solid" :class="PLOT_TYPES[cat].icon"></i>
        </div>
        <div class="category-title">{{ PLOT_TYPES[cat].name }}</div>
      </div>

      <div class="plot-grid">
        <!-- 已有的地块 -->
        <div v-for="plot in gameState.farming.plots[cat]" :key="plot.id" class="plot-card" :class="cat">
          <div class="plot-head">
            <div class="plot-icon" :class="{ planted: !!plot.cropId }">
              <i class="fa-solid" :class="plot.cropId ? FARM_CROPS[plot.cropId]?.icon ?? 'fa-question' : 'fa-mound'"></i>
            </div>
            <div class="plot-info">
              <h3>{{ PLOT_TYPES[cat].name }} #{{ plot.id.split('_')[1] }}</h3>
              <div class="plot-meta">等级 {{ plot.level }} · 速度 +{{ ((getPlotSpeedMult(plot.level) - 1) * 100).toFixed(0) }}%</div>
            </div>
          </div>

          <!-- 已种植 -->
          <template v-if="plot.cropId">
            <div style="font-size:13px;font-weight:600;margin-bottom:8px;">{{ t('ui.farming.current', { crop: t(`farming.crops.${plot.cropId!}`) }) }}</div>
            <div class="progress-wrap">
              <div class="progress-label">
                <span>{{ t('ui.farming.growing') }}</span>
                <span>{{ getPlotRemaining(plot) }}s</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getPlotProgress(plot) + '%', background: PLOT_TYPES[cat].color }"></div>
              </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;">
              <button class="btn" style="flex:1;" @click="unassignCrop(plot.id)">{{ t('ui.farming.remove') }}</button>
              <button class="btn" style="flex:1;" @click="upgradePlot(plot.id)">{{ t('ui.farming.upgradePlot', { cost: getUpgradePlotCost(cat, plot.level) }) }}</button>
            </div>
          </template>

          <!-- 空地：选择面板 -->
          <template v-else>
            <div class="crop-select-panel">
              <template v-if="gameState.farming.activeSelectPlot === plot.id">
                <div class="crop-select-header">
                  <span>{{ t('ui.farming.selectCrop') }}</span>
                  <button class="btn btn-sm" @click="toggleCropSelection(null)">{{ t('ui.farming.cancel') }}</button>
                </div>
                <div class="crop-select-list">
                  <div
                    v-for="crop in getCropsByCategory(cat)"
                    :key="crop.id"
                    class="crop-opt"
                    :class="{ locked: s.level < crop.levelReq }"
                    @click="s.level >= crop.levelReq && assignCrop(plot.id, crop.id)"
                  >
                    <div class="crop-opt-icon" :style="{ color: PLOT_TYPES[cat].color }">
                      <i class="fa-solid" :class="crop.icon"></i>
                    </div>
                    <div class="crop-opt-info">
                      <span class="crop-opt-name">{{ t(`farming.crops.${crop.id}`) }}</span>
                      <span class="crop-opt-time">
                        <template v-if="s.level < crop.levelReq">{{ t('ui.farming.needLevel', { level: crop.levelReq }) }}</template>
                        <template v-else>{{ (crop.growTime / getPlotSpeedMult(plot.level) / 1000).toFixed(0) }}秒 · +{{ crop.xp }} XP</template>
                      </span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="crop-select-empty" @click="toggleCropSelection(plot.id)">
                  <button class="btn btn-primary">
                    <i class="fa-solid fa-seedling"></i> {{ t('ui.farming.plantCrop') }}
                  </button>
                </div>
              </template>
            </div>
            <button class="btn" style="margin-top:8px;width:100%;" @click="upgradePlot(plot.id)">
              {{ t('ui.farming.upgradePlotEmpty', { cost: getUpgradePlotCost(cat, plot.level) }) }}
            </button>
          </template>
        </div>

        <!-- 购买新地块卡片 -->
        <div v-if="gameState.farming.plots[cat].length < PLOT_TYPES[cat].maxPlots" class="plot-card empty" :class="cat">
          <i class="fa-solid fa-plus-circle buy-icon" :style="{ color: PLOT_TYPES[cat].color }"></i>
          <div class="buy-text">{{ t('ui.farming.buyPlot', { name: cat === 'veg' ? t('farming.plots.veg') : cat === 'herb' ? t('farming.plots.herb') : t('farming.plots.tree') }) }}</div>
          <div class="buy-remain">{{ t('ui.farming.plotsLeft', { count: PLOT_TYPES[cat].maxPlots - gameState.farming.plots[cat].length }) }}</div>
          <button
            class="btn btn-primary"
            :disabled="gameState.gold < getBuyPlotCost(cat)"
            @click="buyPlot(cat)"
          >
            {{ t('ui.farming.buyCost', { cost: getBuyPlotCost(cat) }) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.farming-view { animation: fadeIn 0.2s ease; }

.page-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.page-title { font-family: var(--font-title); font-size: 28px; font-weight: 700; color: var(--gold-hi); margin-bottom: 4px; }
.page-sub { color: var(--text-dim); font-size: 13px; }

.skill-overview { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding: 16px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; }
.skill-icon-big { width: 56px; height: 56px; border-radius: 12px; background: linear-gradient(135deg, var(--bg-card-hi), var(--bg-base)); display: flex; align-items: center; justify-content: center; font-size: 26px; color: #8bc34a; border: 1px solid var(--border-hi); flex-shrink: 0; }
.skill-info { flex: 1; min-width: 0; }
.skill-name { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.xp-bar { height: 14px; background: var(--bg-base); border-radius: 7px; overflow: hidden; margin-top: 6px; border: 1px solid var(--border); position: relative; }
.xp-fill { height: 100%; transition: width 0.4s ease; }
.xp-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.8); pointer-events: none; }

/* 分类 */
.farm-category { margin-bottom: 32px; }
.category-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.category-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.category-title { font-family: var(--font-title); font-size: 18px; font-weight: 700; color: var(--text); }

.plot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

/* 地块卡片 */
.plot-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 18px; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.plot-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
.plot-card.veg::before { background: #8bc34a; }
.plot-card.herb::before { background: #b968e0; }
.plot-card.tree::before { background: #a1887f; }
.plot-card.empty { border-style: dashed; opacity: 0.8; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 200px; }

.plot-head { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.plot-icon { width: 44px; height: 44px; border-radius: 8px; background: var(--bg-base); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--text-faint); border: 1px solid var(--border); }
.plot-icon.planted { color: var(--success); border-color: var(--success); }
.plot-info h3 { font-size: 15px; font-weight: 700; }
.plot-meta { font-size: 11px; color: var(--gold); font-weight: 600; margin-top: 2px; }

.progress-wrap { margin-top: 12px; }
.progress-label { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; color: var(--text-dim); }
.progress-bar { height: 12px; background: var(--bg-base); border-radius: 6px; overflow: hidden; border: 1px solid var(--border); }
.progress-fill { height: 100%; transition: width 0.1s linear; }

/* 作物选择面板 */
.crop-select-panel { margin-top: 12px; background: var(--bg-deep); border: 1px solid var(--border); border-radius: 8px; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.crop-select-header { padding: 8px 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-dim); }
.crop-select-list { max-height: 180px; overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.crop-select-empty { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; }

.crop-opt { background: var(--bg-base); border: 1px solid transparent; padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.15s; }
.crop-opt:hover { border-color: var(--gold-dim); background: var(--bg-card-hi); }
.crop-opt.locked { opacity: 0.4; cursor: not-allowed; }
.crop-opt-icon { width: 24px; text-align: center; font-size: 14px; }
.crop-opt-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
.crop-opt-name { font-size: 13px; font-weight: 500; }
.crop-opt-time { font-size: 11px; color: var(--text-faint); }

/* 购买卡片 */
.buy-icon { font-size: 32px; margin-bottom: 12px; }
.buy-text { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.buy-remain { font-size: 11px; color: var(--text-faint); margin-bottom: 12px; }

/* 按钮 */
.btn { padding: 8px 14px; background: var(--bg-card-hi); border: 1px solid var(--border-hi); color: var(--text); border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s; font-family: var(--font-body); display: inline-flex; align-items: center; gap: 6px; justify-content: center; }
.btn:hover { background: var(--bg-card); border-color: var(--gold-dim); }
.btn-sm { padding: 2px 8px; font-size: 11px; }
.btn-primary { background: linear-gradient(180deg, var(--gold), var(--gold-dim)); border-color: var(--gold-dim); color: #1a1410; font-weight: 700; }
.btn-primary:hover:not(:disabled) { background: linear-gradient(180deg, var(--gold-hi), var(--gold)); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
