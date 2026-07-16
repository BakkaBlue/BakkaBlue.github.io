<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { gameState } from '@/engine/state/GameState'
import StatChip from '@/ui/components/StatChip.vue'
import { autoSave } from '@/engine/services/SaveSystem'
import { eventBus } from '@/engine/events/EventBus'
import { formatNumber } from '@/shared/utils/format'

const { t } = useI18n()

function onSave() {
  autoSave()
  eventBus.emit('toast', { message: t('common.save_success'), type: 'success' })
}
</script>

<template>
  <header class="topbar">
    <div class="logo">
      <i class="fa-solid fa-crown"></i>
      <span>Idle Realms</span>
    </div>

    <div class="stats-row">
      <StatChip icon="fa-coins" :value="formatNumber(gameState.gold)" color="var(--gold)" />
      <StatChip icon="fa-heart" :value="`${gameState.hp}/${gameState.maxHp}`" color="var(--hp)" />
    </div>

    <button class="save-btn" @click="onSave" :title="t('common.save')">
      <i class="fa-solid fa-floppy-disk"></i>
    </button>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: linear-gradient(180deg, #2a1f15 0%, #1c1610 100%);
  border-bottom: 2px solid var(--border);
  box-shadow: 0 2px 20px rgba(0,0,0,0.5);
  gap: 32px;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-title);
  font-weight: 900;
  font-size: 22px;
  background: linear-gradient(180deg, var(--gold-hi) 0%, var(--gold-dim) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 2px;
  white-space: nowrap;
}

.logo i {
  color: var(--gold);
  -webkit-text-fill-color: var(--gold);
  font-size: 24px;
}

.stats-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
  overflow-x: auto;
}

.save-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-card); border: 1px solid var(--border-hi);
  color: var(--gold-dim); cursor: pointer; font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0; margin-left: auto;
}
.save-btn:hover { color: var(--gold-hi); border-color: var(--gold); background: var(--bg-card-hi); }
</style>
