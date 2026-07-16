<script setup lang="ts">
import { computed } from 'vue'
import { gameState } from '@/engine/state/GameState'
import { ITEMS } from '@/data/items'
import { getAllBuildings, getUpgradeCost, canUpgrade, upgradeBuilding } from '@/engine/systems/TownSystem'
import { getFacilityLevel, getFacilityCost, getFacilityRate, upgradeFacility } from '@/engine/systems/TownSystem'
import { FACILITIES } from '@/data/facilities'
import { useI18n } from 'vue-i18n'
import { getActiveBuffs } from '@/engine/systems/TownSystem'
const { t } = useI18n()

const buildings = getAllBuildings()

function costItems(buildingId: string) {
  const cost = getUpgradeCost(buildingId)
  return Object.entries(cost).map(([res, qty]) => {
    const isGold = res === 'gold'
    return {
      name: isGold ? '金币' : (ITEMS[res]?.name ?? res),
      icon: isGold ? 'fa-coins' : (ITEMS[res]?.icon ?? 'fa-cube'),
      qty, has: isGold ? gameState.gold : (gameState.inventory[res] ?? 0),
      afford: isGold ? gameState.gold >= qty : (gameState.inventory[res] ?? 0) >= qty,
    }
  })
}

// 城镇资源
const townLogs = computed(() => Math.floor(gameState.town.storage.town_logs ?? 0))
const townOre = computed(() => Math.floor(gameState.town.storage.town_ore ?? 0))

// 活跃 Buffs
const activeBuffs = computed(() => getActiveBuffs())
</script>

<template>
  <div class="town-view">
    <div class="page-header">
      <div class="page-title">{{ t('ui.pages.town.title') }}</div>
      <div class="page-sub">{{ t('ui.pages.town.sub') }}</div>
    </div>

    <!-- 城镇资源条 -->
    <div class="resource-bar">
      <div class="res-chip"><i class="fa-solid fa-coins"></i> 金币: <strong>{{ gameState.gold }}</strong></div>
      <div class="res-chip"><i class="fa-solid fa-tree"></i> 城镇木材: <strong>{{ townLogs }}</strong></div>
      <div class="res-chip"><i class="fa-solid fa-gem"></i> 城镇矿石: <strong>{{ townOre }}</strong></div>
    </div>

    <!-- Buff 条 -->
    <div v-if="activeBuffs.length" class="buff-bar">
      <div v-for="b in activeBuffs" :key="b.id" class="buff-chip" :title="b.name">
        <i class="fa-solid" :class="b.icon"></i>
        {{ b.name }} {{ b.remaining }}s
      </div>
    </div>

    <!-- === 功能建筑 === -->
    <h3 class="section-title">{{ t('ui.town.buildings') }}</h3>
    <div class="town-grid">
      <div v-for="b in buildings" :key="b.id" class="building-card">
        <div class="building-head">
          <div class="building-icon"><i class="fa-solid" :class="b.icon"></i></div>
          <div class="building-info">
            <h3>{{ b.name }}</h3>
            <div class="building-level">等级 {{ b.level }}</div>
          </div>
        </div>
        <div class="building-desc">{{ b.description }}</div>
        <div class="building-effect">当前效果：{{ b.effectDescription(b.level) }}</div>
        <div class="building-cost">
          <span v-for="ci in costItems(b.id)" :key="ci.name" class="cost-item" :class="{ afford: ci.afford, unafford: !ci.afford }">
            <i class="fa-solid" :class="ci.icon"></i> {{ ci.has }}/{{ ci.qty }}
          </span>
        </div>
        <button class="btn btn-primary" :disabled="!canUpgrade(b.id)" @click="upgradeBuilding(b.id)">
          升级至 Lv.{{ b.level + 1 }}
        </button>
      </div>
    </div>

    <!-- === 产出设施 === -->
    <h3 class="section-title">{{ t('ui.town.facilities') }}</h3>
    <div class="town-grid">
      <div v-for="f in Object.values(FACILITIES)" :key="f.id" class="building-card facility">
        <div class="building-head">
          <div class="building-icon"><i class="fa-solid" :class="f.icon"></i></div>
          <div class="building-info">
            <h3>{{ f.name }}</h3>
            <div class="building-level">等级 {{ getFacilityLevel(f.id) }}</div>
          </div>
        </div>
        <div class="building-desc">{{ f.description }}</div>
        <div class="building-effect">
          当前产能：{{ getFacilityRate(f.id).toFixed(2) }} {{ f.resourceName }}/秒
        </div>
        <div class="building-cost">
          <span class="cost-item" :class="{ afford: gameState.gold >= getFacilityCost(f.id), unafford: gameState.gold < getFacilityCost(f.id) }">
            <i class="fa-solid fa-coins"></i> {{ getFacilityCost(f.id) }}
          </span>
        </div>
        <button class="btn btn-primary" :disabled="gameState.gold < getFacilityCost(f.id)" @click="upgradeFacility(f.id)">
          升级至 Lv.{{ getFacilityLevel(f.id) + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.town-view { animation: fadeIn 0.2s ease; }

.page-header { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.page-title { font-family: var(--font-title); font-size: 24px; font-weight: 700; color: var(--gold-hi); margin-bottom: 4px; }
.page-sub { color: var(--text-dim); font-size: 13px; }

.resource-bar {
  display: flex; gap: 16px; margin-bottom: 12px;
  padding: 12px 16px; background: var(--bg-card);
  border: 1px solid var(--border); border-radius: var(--radius-md);
}
.res-chip { font-size: 13px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
.res-chip strong { color: var(--gold); }
.res-chip i { font-size: 14px; }

.buff-bar {
  display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;
}
.buff-chip {
  padding: 4px 12px; background: rgba(185, 104, 224, 0.15);
  border: 1px solid rgba(185, 104, 224, 0.4); border-radius: 20px;
  font-size: 11px; color: var(--magic, #b968e0); display: flex; align-items: center; gap: 4px;
}

.section-title { font-family: var(--font-title); color: var(--gold-hi); font-size: 16px; margin: 20px 0 12px; }

.town-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }

.building-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
  padding: 18px; position: relative; overflow: hidden;
}
.building-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--gold-dim); }
.building-card.facility::before { background: var(--success); }

.building-head { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.building-icon { width: 44px; height: 44px; border-radius: 8px; background: var(--bg-base); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--gold); border: 1px solid var(--border-hi); flex-shrink: 0; }
.building-info h3 { font-size: 15px; font-weight: 700; }
.building-level { font-size: 12px; color: var(--gold); font-weight: 600; margin-top: 2px; }

.building-desc { font-size: 12px; color: var(--text-dim); margin-bottom: 10px; line-height: 1.5; }
.building-effect { background: var(--bg-base); padding: 8px 12px; border-radius: 6px; font-size: 12px; color: var(--success); margin-bottom: 10px; border-left: 2px solid var(--success); }
.building-cost { display: flex; gap: 8px; font-size: 12px; margin-bottom: 10px; flex-wrap: wrap; }
.cost-item { display: flex; align-items: center; gap: 4px; }
.cost-item i { font-size: 10px; }
.cost-item.afford { color: var(--text); }
.cost-item.unafford { color: var(--danger); }

.btn { padding: 8px 16px; background: var(--bg-card-hi); border: 1px solid var(--border-hi); color: var(--text); border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s; width: 100%; font-family: var(--font-body); }
.btn:hover:not(:disabled) { background: var(--bg-card); border-color: var(--gold-dim); }
.btn-primary { background: linear-gradient(180deg, var(--gold), var(--gold-dim)); border-color: var(--gold-dim); color: #1a1410; font-weight: 700; }
.btn-primary:hover:not(:disabled) { background: linear-gradient(180deg, var(--gold-hi), var(--gold)); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
