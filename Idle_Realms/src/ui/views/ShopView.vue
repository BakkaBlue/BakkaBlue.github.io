<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameState } from '@/engine/state/GameState'
import { SHOP_ITEMS } from '@/data/shop'
import { spendGold } from '@/engine/systems/EconomySystem'
import { addItem } from '@/engine/systems/InventorySystem'
import { eventBus } from '@/engine/events/EventBus'
import ItemCard from '@/ui/components/ItemCard.vue'
import ItemDetail from '@/ui/components/ItemDetail.vue'

const { t } = useI18n()
const detail = ref<InstanceType<typeof ItemDetail> | null>(null)

function buyItem(itemId: string, price: number) {
  if (!spendGold(price)) {
    eventBus.emit('toast', { message: t('toasts.goldInsufficient'), type: 'danger' })
    return
  }
  addItem(itemId, 1)
  eventBus.emit('toast', { message: t('toasts.purchased', { item: t(`items.${itemId}`) }), type: 'success' })
}

function showDetail(itemId: string, e: MouseEvent) {
  e.preventDefault()
  detail.value?.show(itemId)
}
</script>

<template>
  <div class="shop-view">
    <div class="shop-gold">
      {{ t('ui.shop.goldLabel') }}<strong>{{ gameState.gold }}</strong>
      <span class="shop-hint">{{ t('ui.shop.hint') }}</span>
    </div>

    <div class="shop-grid">
      <div
        v-for="entry in SHOP_ITEMS" :key="entry.id" class="shop-card"
        @click="buyItem(entry.id, entry.price)"
        @contextmenu="showDetail(entry.id, $event)"
      >
        <ItemCard :item-id="entry.id" />
        <button
          class="buy-btn"
          :class="{ disabled: gameState.gold < entry.price }"
          @click.stop="buyItem(entry.id, entry.price)"
        >
          💰 {{ entry.price }}
        </button>
      </div>
    </div>

    <ItemDetail ref="detail" />
  </div>
</template>

<style scoped>
.shop-view { animation: fadeIn 0.2s ease; }
.shop-gold { padding: 12px 18px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 20px; font-size: 15px; display: flex; align-items: center; gap: 16px; }
.shop-gold strong { color: var(--gold); }
.shop-hint { font-size: 11px; color: var(--text-faint); margin-left: auto; }
.shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
.shop-card { display: flex; flex-direction: column; gap: 8px; cursor: pointer; }
.shop-card:hover { transform: translateY(-1px); }
.buy-btn { padding: 8px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--gold); font-size: 12px; font-weight: 600; transition: all 0.15s; cursor: pointer; font-family: var(--font-body); }
.buy-btn:hover { background: var(--bg-card-hi); border-color: var(--border-hi); }
.buy-btn.disabled { opacity: 0.3; cursor: not-allowed; }
</style>
