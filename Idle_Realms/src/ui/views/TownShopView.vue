<script setup lang="ts">
import { computed } from 'vue'
import { gameState } from '@/engine/state/GameState'
import { TOWN_SHOP_ITEMS } from '@/data/town-shop'
import { canBuyTownItem, buyTownItem } from '@/engine/systems/TownSystem'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const townLogs = computed(() => Math.floor(gameState.town.storage.town_logs ?? 0))
const townOre = computed(() => Math.floor(gameState.town.storage.town_ore ?? 0))

function costDisplay(item: typeof TOWN_SHOP_ITEMS[number]) {
  return Object.entries(item.cost).map(([res, qty]) => {
    const has = gameState.town.storage[res] ?? 0
    const label = res === 'town_logs' ? t('facilities.lumber_mill.resourceName') : t('facilities.mine.resourceName')
    const icon = res === 'town_logs' ? 'fa-tree' : 'fa-gem'
    return { label, icon, has: Math.floor(has), need: qty, afford: has >= qty }
  })
}
</script>

<template>
  <div class="shop-view">
    <div class="page-header">
      <div class="page-title">{{ t('ui.pages.town_shop.title') }}</div>
      <div class="page-sub">{{ t('ui.pages.town_shop.sub') }}</div>
    </div>

    <!-- 城镇资源 -->
    <div class="resource-bar">
      <div class="res-chip"><i class="fa-solid fa-tree"></i> {{ t('ui.town.townLogs') }}<strong>{{ townLogs }}</strong></div>
      <div class="res-chip"><i class="fa-solid fa-gem"></i> {{ t('ui.town.townOre') }}<strong>{{ townOre }}</strong></div>
    </div>

    <!-- 商品列表 -->
    <div class="shop-grid">
      <div v-for="item in TOWN_SHOP_ITEMS" :key="item.id" class="shop-card">
        <div class="shop-head">
          <div class="shop-icon"><i class="fa-solid" :class="item.icon"></i></div>
          <div class="shop-info">
            <h3>{{ t(`townShop.${item.id}.name`) }}</h3>
            <span class="shop-tag">{{ item.type === 'buff' ? t('townShop.tag_buff') : t('townShop.tag_equip') }}</span>
          </div>
        </div>
        <div class="shop-desc">{{ t(`townShop.${item.id}.desc`) }}</div>

        <div class="shop-cost">
          <span v-for="cd in costDisplay(item)" :key="cd.label" class="cost-item" :class="{ afford: cd.afford, unafford: !cd.afford }">
            <i class="fa-solid" :class="cd.icon"></i> {{ cd.has }}/{{ cd.need }}
          </span>
        </div>

        <button class="btn btn-primary" :disabled="!canBuyTownItem(item.id)" @click="buyTownItem(item.id)">
          {{ t('common.purchase') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-view { animation: fadeIn 0.2s ease; }

.page-header { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.page-title { font-family: var(--font-title); font-size: 24px; font-weight: 700; color: var(--gold-hi); margin-bottom: 4px; }
.page-sub { color: var(--text-dim); font-size: 13px; }

.resource-bar {
  display: flex; gap: 16px; margin-bottom: 20px;
  padding: 12px 16px; background: var(--bg-card);
  border: 1px solid var(--border); border-radius: var(--radius-md);
}
.res-chip { font-size: 13px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
.res-chip strong { color: var(--gold); }
.res-chip i { font-size: 14px; }

.shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }

.shop-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
  padding: 18px; position: relative; overflow: hidden;
}
.shop-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--magic, #b968e0); }

.shop-head { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.shop-icon {
  width: 44px; height: 44px; border-radius: 8px; background: var(--bg-base);
  display: flex; align-items: center; justify-content: center; font-size: 20px;
  color: var(--magic, #b968e0); border: 1px solid var(--border-hi); flex-shrink: 0;
}
.shop-info h3 { font-size: 15px; font-weight: 700; }
.shop-tag {
  font-size: 10px; padding: 2px 6px; background: rgba(185,104,224,0.15);
  color: var(--magic, #b968e0); border-radius: 4px;
}

.shop-desc { font-size: 12px; color: var(--text-dim); margin-bottom: 10px; line-height: 1.5; }

.shop-cost { display: flex; gap: 8px; font-size: 12px; margin-bottom: 10px; flex-wrap: wrap; }
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
