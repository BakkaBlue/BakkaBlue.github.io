<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameState } from '@/engine/state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { getSkillAction } from '@/data/skills'
import { ENEMIES } from '@/data/monsters'
import { timeNow } from '@/shared/utils/format'
import type { SkillId } from '@/data/skills'

const { t } = useI18n()

// ---- 日志 ----
interface LogEntry { id: number; time: string; message: string; type: string }
const logs = ref<LogEntry[]>([])
let logId = 0

function addLog(message: string, type = '') {
  logs.value.unshift({ id: logId++, time: timeNow(), message, type })
  if (logs.value.length > 50) logs.value.pop()
}

eventBus.on('item:acquired', (p) => {
  const { itemId, qty } = p as { itemId: string; qty: number }
  addLog(t('ui.log.itemAcquired', { name: `<strong>${t(`items.${itemId}`)}</strong>`, qty }), 'success')
})
eventBus.on('skill:levelup', (p) => {
  const { skillId, newLevel } = p as { skillId: SkillId; newLevel: number }
  addLog(t('ui.log.skillLevelup', { name: `<strong>${t(`skills.${skillId}`)}</strong>`, level: newLevel }), 'xp')
})
eventBus.on('combat:victory', (p) => {
  const { enemyName, gold } = p as { enemyName: string; gold: number }
  addLog(t('ui.log.combatVictory', { name: `<strong>${enemyName}</strong>`, gold }), 'gold')
})
eventBus.on('combat:defeat', (p) => {
  const { enemyName } = p as { enemyName: string }
  addLog(t('ui.log.combatDefeat', { name: `<strong>${enemyName}</strong>` }), 'danger')
})
eventBus.on('action:started', (p) => {
  const { skillId, actionId } = p as { skillId: SkillId; actionId: string }
  addLog(t('ui.log.actionStarted', {
    skillName: t(`skills.${skillId}`),
    actionName: `<strong>${t(`skills.actions.${actionId}`)}</strong>`,
  }))
})
eventBus.on('food:eaten', (p) => {
  const { foodId, healAmount } = p as { foodId: string; healAmount: number }
  addLog(t('ui.log.foodEaten', { name: `<strong>${t(`items.${foodId}`)}</strong>`, healAmount }), 'success')
})
eventBus.on('slayer:task-completed', (p) => {
  const { enemyName, kills, points } = p as { enemyName: string; kills: number; points: number }
  addLog(t('ui.log.slayerComplete', { kills, enemy: enemyName, points }), 'xp')
})

// ---- 当前活动 ----
const caName = () => {
  const ca = gameState.currentAction
  if (!ca) return t('ui.log.noAction')
  if (ca.skill === 'combat') {
    if (gameState.combat.inBattle) {
      const eid = gameState.combat.enemyId
      const ename = eid ? ENEMIES.find(e => e.id === eid)?.name ?? eid : t('common.unknown')
      return `⚔️ ${t('ui.combat.playerName')} - ${ename}`
    }
    return `⚔️ ${t('skills.combat')}`
  }
  return `${t(`skills.${ca.skill}`)} - ${t(`skills.actions.${ca.actionId}`)}`
}

const caProgress = () => {
  const ca = gameState.currentAction
  if (!ca || !ca.totalTime) return 0
  return Math.min(ca.progress / ca.totalTime, 1)
}

const caDrops = () => {
  const ca = gameState.currentAction
  if (!ca || ca.skill === 'combat') return []
  const action = getSkillAction(ca.skill, ca.actionId)
  if (!action?.drops) return []
  return Object.entries(action.drops).map(([id, qty]) => ({ name: t(`items.${id}`), qty }))
}
</script>

<template>
  <aside class="right-panel">
    <section class="panel-section">
      <h3>{{ t('ui.log.currentActivity') }}</h3>
      <div class="current-action">
        <p class="action-name">{{ caName() }}</p>
        <div v-if="gameState.currentAction" class="progress-bar-wrap">
          <div class="progress-bar-fill" :style="{ width: (caProgress() * 100) + '%' }"></div>
        </div>
        <div v-if="caDrops().length" class="drops-preview">
          <span v-for="d in caDrops()" :key="d.name" class="drop-tag">{{ d.name }} ×{{ d.qty }}</span>
        </div>
        <p v-if="!gameState.currentAction" class="idle-hint">{{ t('ui.log.idle') }}</p>
      </div>
    </section>

    <section class="panel-section log-section">
      <h3>{{ t('ui.log.logTitle') }}</h3>
      <div class="log-list">
        <div v-for="l in logs" :key="l.id" class="log-entry" :class="l.type">
          <span class="log-time">{{ l.time }}</span>
          <span v-html="l.message"></span>
        </div>
        <p v-if="!logs.length" class="log-empty">{{ t('ui.log.empty') }}</p>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.right-panel {
  width: var(--right-panel-w); min-width: var(--right-panel-w);
  background: var(--bg-base); border-left: 1px solid var(--border);
  display: flex; flex-direction: column; overflow: hidden;
}
.panel-section { padding: 16px; border-bottom: 1px solid var(--border); }
.panel-section h3 { font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
.current-action { text-align: center; }
.action-name { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.progress-bar-wrap { height: 8px; background: var(--bg-deep); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--gold-dim), var(--gold)); border-radius: 4px; transition: width 0.3s ease; box-shadow: 0 0 6px rgba(230,181,102,0.3); }
.drops-preview { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.drop-tag { font-size: 11px; padding: 2px 8px; background: var(--bg-card); border-radius: 10px; color: var(--text-dim); }
.idle-hint { font-size: 12px; color: var(--text-faint); }
.log-section { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.log-list { flex: 1; overflow-y: auto; }
.log-entry { padding: 3px 0 3px 8px; font-size: 11px; color: var(--text-dim); border-left: 2px solid var(--gold-dim); margin-bottom: 4px; line-height: 1.5; animation: slideInLeft 0.25s ease; }
.log-entry.success { border-left-color: var(--success); color: var(--text); }
.log-entry.danger { border-left-color: var(--danger); }
.log-entry.xp { border-left-color: var(--xp); }
.log-entry.gold { border-left-color: var(--gold); }
.log-time { color: var(--text-faint); font-size: 10px; margin-right: 4px; }
.log-empty { font-size: 12px; color: var(--text-faint); text-align: center; padding: 20px 0; }
</style>
