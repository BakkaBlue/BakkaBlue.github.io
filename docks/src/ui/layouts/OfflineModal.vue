<script setup lang="ts">
import { ref } from 'vue'
import { eventBus } from '@/engine/events/EventBus'
import { useI18n } from 'vue-i18n'
import type { OfflineReport } from '@/engine/state/types'
const { t } = useI18n()

const show = ref(false)
const report = ref<OfflineReport | null>(null)

eventBus.on('offline:show', (payload) => {
  const r = payload as OfflineReport
  if (r) {
    // 检查是否有实际收益
    const hasSkillResult = r.skillResults.length > 0
    const hasCombatResult = r.combatResult && r.combatResult.battles > 0
    if (hasSkillResult || hasCombatResult) {
      report.value = r
      show.value = true
    }
  }
})

function dismiss() {
  show.value = false
  report.value = null
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="dismiss">
      <div class="modal-card">
        <div class="modal-header">
          <i class="fa-solid fa-moon"></i>
          <h2>{{ t('ui.offline.title') }}</h2>
        </div>
        <p class="modal-sub">{{ t('ui.offline.away', { duration: report?.elapsedFormatted ?? '' }) }}</p>

        <div v-if="report?.skillResults.length" class="result-section">
          <div v-for="r in report.skillResults" :key="r.skillId" class="result-block">
            <p class="result-line">🎯 {{ r.actionName }} × <strong>{{ r.cycles }}</strong> 次</p>
            <p v-for="(qty, itemId) in r.items" :key="itemId" class="result-line secondary">
              📦 获得物品 × {{ qty }}
            </p>
            <p class="result-line secondary">⭐ 经验 +{{ r.totalXp }}</p>
          </div>
        </div>

        <div v-if="report?.combatResult && report.combatResult.battles > 0" class="result-section">
          <div class="result-block">
            <p class="result-line">
              ⚔️ 离线战斗：<strong>{{ report.combatResult.battles }}</strong> 场（胜利 {{ report.combatResult.wins }} 场）
            </p>
            <p class="result-line secondary">💰 获得金币 {{ report.combatResult.totalGold }}</p>
            <p class="result-line secondary">⭐ 战斗经验 +{{ report.combatResult.totalXp }}</p>
          </div>
        </div>

        <button class="dismiss-btn" @click="dismiss">{{ t('ui.offline.claim') }}</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-card {
  background: var(--bg-card);
  border: 2px solid var(--border-hi);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 440px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.modal-header i {
  font-size: 24px;
  color: var(--gold);
}

.modal-header h2 {
  font-family: var(--font-title);
  font-size: 20px;
  color: var(--gold);
}

.modal-sub {
  color: var(--text-dim);
  margin-bottom: 20px;
}

.result-section {
  text-align: left;
  margin-bottom: 16px;
}

.result-block {
  background: var(--bg-base);
  border-radius: var(--radius-sm);
  padding: 12px;
  margin-bottom: 8px;
}

.result-line {
  font-size: 13px;
  color: var(--text);
  margin-bottom: 3px;
}

.result-line.secondary {
  font-size: 12px;
  color: var(--text-dim);
  padding-left: 12px;
}

.dismiss-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(180deg, var(--gold-hi), var(--gold-dim));
  color: var(--bg-deep);
  font-size: 15px;
  font-weight: 700;
  border-radius: var(--radius-md);
  transition: transform 0.15s;
}

.dismiss-btn:hover {
  transform: scale(1.02);
}

.dismiss-btn:active {
  transform: scale(0.98);
}
</style>
