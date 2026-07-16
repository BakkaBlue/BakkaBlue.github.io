<script setup lang="ts">
import { ref } from 'vue'
import { uiState, resetUIState } from '@/ui/state/UIState'
import { ViewType } from '@/engine/state/types'
import { startEngine, stopEngine } from '@/engine/bootstrap/GameEngine'
import { applyTheme } from '@/ui/services/SettingsState'
import SaveMenu from '@/ui/layouts/SaveMenu.vue'
import AppLayout from '@/ui/layouts/AppLayout.vue'
import SkillGridView from '@/ui/views/SkillGridView.vue'
import SkillView from '@/ui/views/SkillView.vue'
import CombatView from '@/ui/views/CombatView.vue'
import EquipmentView from '@/ui/views/EquipmentView.vue'
import InventoryView from '@/ui/views/InventoryView.vue'
import ShopView from '@/ui/views/ShopView.vue'
import SlayerView from '@/ui/views/SlayerView.vue'
import FarmingView from '@/ui/views/FarmingView.vue'
import TownView from '@/ui/views/TownView.vue'
import TownShopView from '@/ui/views/TownShopView.vue'
import SettingsView from '@/ui/views/SettingsView.vue'
import Toast from '@/ui/components/Toast.vue'

// 应用主题
applyTheme()

const inGame = ref(false)

function onEnterGame() {
  inGame.value = true
  startEngine()
}

// 暴露给全局（Sidebar 中的"返回菜单"需要）
;(window as any).__exitToMenu = () => {
  stopEngine()
  resetUIState()
  inGame.value = false
}
</script>

<template>
  <SaveMenu v-if="!inGame" @enter-game="onEnterGame" />
  <template v-else>
    <AppLayout>
      <SkillGridView v-if="uiState.currentView === ViewType.SkillGrid" />
      <SkillView v-else-if="uiState.currentView === ViewType.SkillDetail" :skill-id="uiState.detailSkillId!" />
      <CombatView v-else-if="uiState.currentView === ViewType.Combat" />
      <EquipmentView v-else-if="uiState.currentView === ViewType.Equipment" />
      <InventoryView v-else-if="uiState.currentView === ViewType.Inventory" />
      <ShopView v-else-if="uiState.currentView === ViewType.Shop" />
      <SlayerView v-else-if="uiState.currentView === ViewType.Slayer" />
      <FarmingView v-else-if="uiState.currentView === ViewType.Farming" />
      <TownView v-else-if="uiState.currentView === ViewType.Town" />
      <TownShopView v-else-if="uiState.currentView === ViewType.TownShop" />
      <SettingsView v-else-if="uiState.currentView === ViewType.Settings" />
      <div v-else class="empty-view">
        <p>选择一项技能开始冒险</p>
      </div>
    </AppLayout>
    <Toast />
  </template>
</template>

<style>
@import '@/assets/styles/variables.css';
@import '@/assets/styles/base.css';
@import '@/assets/styles/animations.css';
</style>

<style scoped>
.empty-view {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: var(--text-faint); font-size: 16px;
}
</style>
