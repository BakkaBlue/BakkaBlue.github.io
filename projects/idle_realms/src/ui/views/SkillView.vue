<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameState } from '@/engine/state/GameState'
import { getSkillConfig, type SkillId } from '@/data/skills'
import { startAction, stopAction } from '@/engine/systems/SkillSystem'
import { xpForLevel } from '@/engine/systems/ExperienceSystem'
import { useDependencies } from '@/ui/composables/useDependencies'
import { uiState } from '@/ui/state/UIState'
import { ViewType } from '@/engine/state/types'
import { ITEMS } from '@/data/items'

const { t } = useI18n()

const props = defineProps<{ skillId: SkillId }>()

const skill = computed(() => getSkillConfig(props.skillId))
const s = computed(() => gameState.skills[props.skillId])
const actions = computed(() => skill.value?.actions ?? [])
const xpNext = computed(() => xpForLevel(s.value.level))
const xpPct = computed(() => xpNext.value > 0 ? (s.value.xp / xpNext.value) * 100 : 0)

const { consumes, produces, requiredBy } = useDependencies(props.skillId)

function getItemIcon(itemId: string): string {
  return ITEMS[itemId]?.icon ?? 'fa-question'
}

function navigateToSkill(skillId: SkillId) {
  uiState.detailSkillId = skillId
  uiState.currentView = ViewType.SkillDetail
}

const isLocked = computed(() => {
  const cond = skill.value?.unlockCondition
  if (!cond) return false
  return gameState.skills[cond.skill].level < cond.level
})

const currentAction = computed(() => gameState.currentAction)
const isActiveAction = (actionId: string) =>
  currentAction.value?.skill === props.skillId && currentAction.value?.actionId === actionId

const activeProgress = computed(() => {
  const ca = currentAction.value
  if (!ca || ca.skill !== props.skillId) return { pct: 0, elapsed: 0, total: 0 }
  return {
    pct: Math.min(100, (ca.progress / ca.totalTime) * 100),
    elapsed: ca.progress / 1000,
    total: ca.totalTime / 1000,
  }
})

function dropNames(action: typeof actions.value[0]): string {
  return Object.keys(action.drops).map(id => t(`items.${id}`)).join(', ')
}
function getUnlockCondition(): string {
  const cond = skill.value?.unlockCondition
  if (!cond) return ''
  return t('ui.skill.unlockHint', { skill: t(`skills.${cond.skill}`), level: cond.level })
}

function onToggle(actionId: string) {
  if (isActiveAction(actionId)) {
    stopAction()
  } else {
    startAction(props.skillId, actionId)
  }
}
</script>

<template>
  <div class="skill-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">{{ t(`skills.${props.skillId}`) }}</div>
      <div class="page-sub">{{ t('ui.skill.hint') }}</div>
    </div>

    <!-- 技能总览 -->
    <div class="skill-overview">
      <div class="skill-icon-big">
        <i class="fa-solid" :class="skill?.icon"></i>
      </div>
      <div class="skill-info">
        <div class="skill-name">{{ t(`skills.${props.skillId}`) }} <span class="skill-lv">Lv.{{ s.level }}</span></div>
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: xpPct + '%' }"></div>
          <div class="xp-text">{{ s.xp }} / {{ xpNext }}</div>
        </div>
      </div>
    </div>

    <!-- 未解锁 -->
    <div v-if="isLocked" class="locked-msg">
      <i class="fa-solid fa-lock"></i>
      <span>{{ getUnlockCondition() }}</span>
    </div>

    <!-- 依赖链 -->
    <div class="dependencies-section">
      <div v-if="consumes.length > 0" class="dep-group">
        <div class="dep-label">{{ t('ui.skillDetail.consumes') }}</div>
        <div class="dep-items">
          <div v-for="dep in consumes" :key="dep.itemId" class="dep-item">
            <i class="fa-solid" :class="getItemIcon(dep.itemId)"></i>
            <span>{{ t(`items.${dep.itemId}`) }}</span>
            <span class="dep-from">({{ t(`skills.${dep.fromSkill}`) }})</span>
          </div>
        </div>
      </div>

      <div v-if="produces.length > 0" class="dep-group">
        <div class="dep-label">{{ t('ui.skillDetail.produces') }}</div>
        <div class="dep-items">
          <div v-for="dep in produces" :key="dep.itemId" class="dep-item">
            <i class="fa-solid" :class="getItemIcon(dep.itemId)"></i>
            <span>{{ t(`items.${dep.itemId}`) }}</span>
          </div>
        </div>
      </div>

      <div v-if="requiredBy.length > 0" class="dep-group">
        <div class="dep-label">{{ t('ui.skillDetail.dependencies') }}</div>
        <div class="dep-items">
          <div v-for="sid in requiredBy" :key="sid" class="dep-item dep-skill" @click="navigateToSkill(sid)">
            <span>{{ t(`skills.${sid}`) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 动作网格 -->
    <div v-if="!isLocked" class="res-grid">
      <div
        v-for="action in actions"
        :key="action.id"
        class="res-card"
        :class="{
          locked: s.level < action.levelReq,
          active: isActiveAction(action.id),
        }"
        @click="s.level >= action.levelReq && onToggle(action.id)"
      >
        <!-- 头部 -->
        <div class="res-card-head">
          <span class="res-card-title">{{ action.name }}</span>
          <span class="res-card-req">
            {{ s.level < action.levelReq ? t('ui.skill.needLevel', { level: action.levelReq }) : `Lv.${action.levelReq}+` }}
          </span>
        </div>

        <!-- 大图标 -->
        <div class="res-card-body">
          <i class="fa-solid res-card-icon" :class="action.icon"></i>
        </div>

        <!-- 属性行 -->
        <div class="res-card-stats">
          <div class="res-stat">
            <i class="fa-solid fa-star"></i>
            <span>{{ action.xp }} XP</span>
          </div>
          <div class="res-stat">
            <i class="fa-solid fa-clock"></i>
            <span>{{ (action.time / 1000).toFixed(1) }}s</span>
          </div>
          <div class="res-stat drop">
            <i class="fa-solid fa-cube"></i>
            <span>{{ dropNames(action) }}</span>
          </div>
          <div v-if="action.consume" class="res-stat consume">
            <i class="fa-solid fa-fire"></i>
            <span>{{ Object.entries(action.consume).map(([, q]) => `${q}x`).join(', ') }}</span>
          </div>
        </div>

        <!-- 底部 -->
        <div class="res-card-foot">
          <template v-if="isActiveAction(action.id)">
            <div class="res-progress">
              <div class="res-progress-fill" :style="{ width: activeProgress.pct + '%' }"></div>
            </div>
            <div class="res-progress-text">
              {{ activeProgress.elapsed.toFixed(1) }}s / {{ activeProgress.total.toFixed(1) }}s
            </div>
            <button class="res-stop-btn" @click.stop="stopAction()">{{ t('ui.skill.stopAction') }}</button>
          </template>
          <template v-else-if="s.level < action.levelReq">
            <div class="res-locked-text">{{ t('ui.skill.unlocked') }}</div>
          </template>
          <template v-else>
            <button class="res-start-btn" @click.stop="onToggle(action.id)">{{ t('ui.skill.startAction') }}</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-view { animation: fadeIn 0.2s ease; }

.page-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.page-title { font-family: var(--font-title); font-size: 28px; font-weight: 700; color: var(--gold-hi); margin-bottom: 4px; }
.page-sub { color: var(--text-dim); font-size: 13px; }

.skill-overview {
  display: flex; align-items: center; gap: 20px; margin-bottom: 24px;
  padding: 16px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
}
.skill-icon-big {
  width: 56px; height: 56px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--bg-card-hi), var(--bg-base));
  display: flex; align-items: center; justify-content: center; font-size: 26px;
  color: var(--gold); border: 1px solid var(--border-hi);
}
.skill-info { flex: 1; min-width: 0; }
.skill-name { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.skill-lv { color: var(--text-dim); font-size: 14px; }

.xp-bar { height: 14px; background: var(--bg-base); border-radius: 7px; overflow: hidden; margin-top: 6px; border: 1px solid var(--border); position: relative; }
.xp-fill { height: 100%; background: linear-gradient(90deg, #d35400, #f39c12); transition: width 0.4s ease; }
.xp-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.8); pointer-events: none; }

/* 资源卡片网格 */
.res-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

.res-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
  overflow: hidden; transition: all 0.2s; cursor: pointer; display: flex; flex-direction: column;
  position: relative;
}
.res-card:hover:not(.locked):not(.active) { border-color: var(--border-hi); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.res-card.locked { opacity: 0.5; filter: grayscale(0.8); cursor: not-allowed; }
.res-card.active { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold), 0 0 20px rgba(230,181,102,0.25); }

.res-card-head {
  padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid var(--border); background: var(--bg-base);
}
.res-card-title { font-weight: 700; font-size: 15px; color: var(--text); }
.res-card-req { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: var(--bg-card-hi); color: var(--text-dim); border: 1px solid var(--border); }

.res-card-body {
  padding: 24px; display: flex; justify-content: center; align-items: center; flex: 1;
  background: radial-gradient(circle, rgba(230,181,102,0.05) 0%, transparent 70%);
}
.res-card-icon { font-size: 56px; color: var(--gold-dim); transition: transform 0.3s; }
.res-card:hover .res-card-icon { transform: scale(1.1); }
.res-card.active .res-card-icon { color: var(--gold); animation: bobbing 1s infinite ease-in-out; }

@keyframes bobbing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

.res-card-stats {
  display: flex; justify-content: space-around; padding: 10px 0;
  border-top: 1px solid var(--border); background: var(--bg-base);
}
.res-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 11px; color: var(--text-dim); }
.res-stat i { color: var(--gold-dim); font-size: 13px; }
.res-stat span { font-weight: 600; color: var(--text); }
.res-stat.drop span { color: var(--success); }
.res-stat.consume span { color: var(--xp); }

.res-card-foot { padding: 12px; border-top: 1px solid var(--border); background: var(--bg-card); }
.res-progress { height: 8px; background: var(--bg-deep); border-radius: 4px; overflow: hidden; margin-bottom: 6px; border: 1px solid var(--border); }
.res-progress-fill { height: 100%; background: linear-gradient(90deg, var(--gold-dim), var(--gold)); transition: width 0.1s linear; box-shadow: 0 0 8px rgba(230,181,102,0.5); }
.res-progress-text { text-align: center; font-size: 11px; color: var(--text-dim); font-weight: 600; }

.res-start-btn {
  width: 100%; padding: 8px; background: var(--bg-base); border: 1px solid var(--border-hi);
  color: var(--text); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.15s;
  font-family: var(--font-body); font-size: 13px;
}
.res-start-btn:hover { background: var(--gold); color: #1a1410; border-color: var(--gold); }

.res-stop-btn {
  width: 100%; margin-top: 8px; padding: 6px; background: transparent;
  border: 1px solid var(--danger); color: var(--danger); border-radius: 6px;
  cursor: pointer; font-weight: 600; transition: all 0.15s;
  font-family: var(--font-body); font-size: 12px;
}
.res-stop-btn:hover { background: rgba(229,57,53,0.15); }

.res-locked-text { text-align: center; color: var(--danger); font-size: 12px; font-weight: 600; }

.locked-msg {
  text-align: center; padding: 60px 40px; color: var(--text-faint);
  display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
}
.locked-msg i { font-size: 24px; }

.dependencies-section {
  margin-bottom: 24px;
  display: flex; flex-direction: column; gap: 12px;
}

.dep-group {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px;
  padding: 12px 16px;
}

.dep-label {
  font-size: 12px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;
  letter-spacing: 0.5px; margin-bottom: 8px;
}

.dep-items {
  display: flex; flex-wrap: wrap; gap: 8px;
}

.dep-item {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 10px; background: var(--bg-base); border: 1px solid var(--border);
  border-radius: 6px; font-size: 13px; color: var(--text);
}

.dep-item i { font-size: 12px; color: var(--gold-dim); }

.dep-from { color: var(--text-faint); font-size: 11px; }

.dep-skill {
  cursor: pointer; transition: all 0.15s; border-color: var(--border-hi);
}
.dep-skill:hover { background: var(--gold); color: #1a1410; border-color: var(--gold); }
</style>
