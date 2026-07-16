<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { uiState } from '@/ui/state/UIState'
import { ViewType } from '@/engine/state/types'

const { t } = useI18n()

// ---- 菜单结构 ----
interface MenuItem {
  id: string
  icon: string
  color: string
  viewType?: ViewType
  category?: 'noncombat' | 'combat'
  isExit?: boolean
  isCategory?: boolean
}

interface MenuGroup {
  title?: string
  items: MenuItem[]
}

const menuGroups = computed<MenuGroup[]>(() => [
  {
    title: t('ui.sidebar.noncombat'),
    items: [
      { id: 'noncombat_overview', icon: 'fa-compass', color: '#8bc34a', category: 'noncombat', isCategory: true },
      { id: 'farming',           icon: 'fa-seedling',  color: '#8bc34a', viewType: ViewType.Farming },
      { id: 'town',              icon: 'fa-landmark',  color: '#e6b566', viewType: ViewType.Town },
      { id: 'town_shop',         icon: 'fa-scroll',    color: '#b968e0', viewType: ViewType.TownShop },
      { id: 'shop',              icon: 'fa-store',     color: '#e6b566', viewType: ViewType.Shop },
      { id: 'inventory',         icon: 'fa-briefcase', color: '#a89880', viewType: ViewType.Inventory },
    ],
  },
  {
    title: t('ui.sidebar.combat'),
    items: [
      { id: 'combat_overview', icon: 'fa-khanda', color: '#e53935', category: 'combat', isCategory: true },
      { id: 'equipment',      icon: 'fa-shield', color: '#b968e0', viewType: ViewType.Equipment },
    ],
  },
  {
    items: [
      { id: 'settings', icon: 'fa-gear',                 color: '#e6b566', viewType: ViewType.Settings },
      { id: 'menu',     icon: 'fa-right-from-bracket',    color: '#e53935', isExit: true },
    ],
  },
])

function isItemActive(item: MenuItem): boolean {
  if (item.isExit) return false
  if (item.isCategory && item.category) {
    return uiState.currentView === ViewType.SkillGrid && uiState.currentCategory === item.category
  }
  return item.viewType !== undefined && uiState.currentView === item.viewType
}

function handleClick(item: MenuItem) {
  if (item.isExit) {
    ;(window as any).__exitToMenu?.()
    return
  }
  if (item.isCategory && item.category) {
    uiState.currentCategory = item.category
    uiState.currentView = ViewType.SkillGrid
    return
  }
  if (item.viewType !== undefined) {
    uiState.currentView = item.viewType
  }
}

function itemLabel(item: MenuItem): string {
  if (item.isCategory && item.category) {
    return t(`ui.skillGrid.${item.category}`)
  }
  return t(`ui.sidebar.${item.id}`)
}
</script>

<template>
  <nav class="sidebar">
    <div v-for="(group, gi) in menuGroups" :key="gi" class="menu-group">
      <div v-if="group.title" class="menu-title">{{ group.title }}</div>
      <button
        v-for="item in group.items"
        :key="item.id"
        class="menu-item"
        :class="{ active: isItemActive(item) }"
        @click="handleClick(item)"
      >
        <i class="fa-solid" :class="item.icon" :style="{ color: item.color }"></i>
        <span>{{ itemLabel(item) }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-w); min-width: var(--sidebar-w);
  background: var(--bg-base); border-right: 1px solid var(--border);
  padding: 16px 12px; overflow-y: auto;
}
.menu-group { margin-bottom: 20px; }
.menu-title {
  font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--text-faint); padding: 0 8px 8px; font-weight: 700;
}
.menu-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border-radius: 8px; cursor: pointer; transition: all 0.15s ease;
  color: var(--text-dim); font-size: 14px; font-weight: 500; position: relative;
  margin-bottom: 2px; background: transparent; border: none; width: 100%;
  text-align: left; font-family: var(--font-body);
}
.menu-item:hover { background: var(--bg-card); color: var(--text); }
.menu-item.active {
  background: linear-gradient(90deg, rgba(230,181,102,0.15), rgba(230,181,102,0.05));
  color: var(--gold-hi); box-shadow: inset 3px 0 0 var(--gold);
}
.menu-item i { width: 20px; text-align: center; font-size: 15px; }
</style>
