<script setup lang="ts">
import { ref } from 'vue'
import { gameState } from '@/engine/state/GameState'
import { ITEMS, RARITY_SELL_MULTIPLIER } from '@/data/items'
import { equipItem, isEquipped, unequipSlot } from '@/engine/systems/EquipmentSystem'
import { eatFood } from '@/engine/systems/FoodSystem'
import { addGold } from '@/engine/systems/EconomySystem'
import { removeItem, hasItem } from '@/engine/systems/InventorySystem'
import { useI18n } from 'vue-i18n'
import { eventBus } from '@/engine/events/EventBus'
import ItemCard from '@/ui/components/ItemCard.vue'
import ContextMenu, { type ContextMenuItem } from '@/ui/components/ContextMenu.vue'
import ItemDetail from '@/ui/components/ItemDetail.vue'

const { t } = useI18n()
const contextMenu = ref<InstanceType<typeof ContextMenu> | null>(null)
const detail = ref<InstanceType<typeof ItemDetail> | null>(null)

// ---- 左键 ----
function onLeftClick(itemId: string) {
  const item = ITEMS[itemId]
  if (!item) return

  if (item.slot) {
    // 装备类：左键切换装备状态
    if (isEquipped(itemId)) {
      unequipSlot(item.slot)
    } else {
      equipItem(itemId)
    }
  } else if (item.heal) {
    // 食物：左键直接吃
    eatFood(itemId)
  } else {
    // 材料/杂项：左键查看详情
    detail.value?.show(itemId)
  }
}

// ---- 右键 ----
function onRightClick(itemId: string, e: MouseEvent) {
  e.preventDefault()
  const item = ITEMS[itemId]
  if (!item) return

  const menu: ContextMenuItem[] = []

  // 检查（始终显示）
  menu.push({ label: t('common.inspect'), icon: 'fa-magnifying-glass', action: () => detail.value?.show(itemId) })

  // 装备 / 卸下
  if (item.slot) {
    if (isEquipped(itemId)) {
      menu.push({ label: t('common.unequip'), icon: 'fa-arrow-down', action: () => unequipSlot(item.slot!) })
    } else {
      menu.push({ label: t('common.equip'), icon: 'fa-shield-halved', action: () => equipItem(itemId) })
    }
  }

  // 食用
  if (item.heal) {
    menu.push({ label: t('common.use'), icon: 'fa-bowl-food', action: () => eatFood(itemId) })
  }

  // 出售
  menu.push({ label: t('common.sell'), icon: 'fa-coins', action: () => sellItem(itemId) })

  // 分割线 + 丢弃
  menu.push({ divider: true })
  menu.push({ label: t('common.drop'), icon: 'fa-trash', danger: true, action: () => dropItem(itemId) })

  contextMenu.value?.show(e.clientX, e.clientY, menu)
}

function sellItem(itemId: string) {
  const item = ITEMS[itemId]
  if (!item || !hasItem(itemId)) return
  const price = Math.floor(item.value * (RARITY_SELL_MULTIPLIER[item.rarity] ?? 0.5))
  removeItem(itemId, 1)
  addGold(price)
  eventBus.emit('toast', { message: t('toasts.sold', { item: t(`items.${itemId}`), gold: price }), type: 'success' })
}

function dropItem(itemId: string) {
  const item = ITEMS[itemId]
  if (!item || !hasItem(itemId)) return
  removeItem(itemId, 1)
  eventBus.emit('toast', { message: t('toasts.dropped', { item: t(`items.${itemId}`) }), type: 'danger' })
}

// 按稀有度排序
const sortedInventory = () => {
  const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common']
  return Object.entries(gameState.inventory)
    .filter(([, qty]) => qty > 0)
    .sort(([aId], [bId]) => {
      const a = rarityOrder.indexOf(ITEMS[aId]?.rarity ?? 'common')
      const b = rarityOrder.indexOf(ITEMS[bId]?.rarity ?? 'common')
      return a - b
    })
}
</script>

<template>
  <div class="inventory-view">
    <p class="hint">{{ t('ui.inventory.hint') }}</p>

    <div v-if="!sortedInventory().length" class="empty">{{ t('ui.inventory.empty') }}</div>

    <div v-else class="inv-grid">
      <div
        v-for="[itemId, qty] in sortedInventory()"
        :key="itemId"
        class="inv-row"
        :class="{ equipped: isEquipped(itemId) }"
        @click="onLeftClick(itemId)"
        @contextmenu="onRightClick(itemId, $event)"
      >
        <ItemCard
          :item-id="itemId"
          :qty="qty"
          :equipped="isEquipped(itemId)"
        />
      </div>
    </div>

    <ContextMenu ref="contextMenu" />
    <ItemDetail ref="detail" />
  </div>
</template>

<style scoped>
.inventory-view { animation: fadeIn 0.2s ease; }
.hint { font-size: 11px; color: var(--text-faint); margin-bottom: 16px; }
.empty { text-align: center; padding: 40px; color: var(--text-faint); font-size: 14px; }
.inv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
.inv-row { transition: transform 0.1s; cursor: pointer; }
.inv-row:hover { transform: translateY(-2px); }
</style>
