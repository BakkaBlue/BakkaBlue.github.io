<script setup lang="ts">
import { gameSettings } from '@/ui/services/SettingsState'
import TopBar from './TopBar.vue'
import Sidebar from './Sidebar.vue'
import RightPanel from './RightPanel.vue'
import OfflineModal from './OfflineModal.vue'
</script>

<template>
  <div class="app">
    <TopBar />
    <div class="body">
      <Sidebar />
      <main class="content">
        <slot />
      </main>
      <RightPanel v-if="gameSettings.general.showRightPanel" />
    </div>
    <OfflineModal />
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-rows: var(--topbar-h) 1fr;
  height: 100vh;
}

.body {
  display: flex;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
