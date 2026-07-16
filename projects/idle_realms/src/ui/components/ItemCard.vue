<script setup lang="ts">
import { ITEMS } from '@/data/items'

const props = defineProps<{
  itemId: string
  qty?: number
  equipped?: boolean
  showActions?: boolean
}>()

const emit = defineEmits<{
  click: [itemId: string]
}>()

const item = () => ITEMS[props.itemId]

const rarityColor = () => {
  const map: Record<string, string> = {
    common: 'var(--text-dim)',
    uncommon: 'var(--success)',
    rare: 'var(--xp)',
    epic: 'var(--mp)',
    legendary: 'var(--gold)',
  }
  return map[item()?.rarity ?? 'common'] ?? 'var(--text-dim)'
}
</script>

<template>
  <div
    v-if="item()"
    class="item-card"
    :class="{ equipped }"
    :style="{ borderColor: equipped ? 'var(--success)' : undefined }"
    @click="emit('click', itemId)"
  >
    <div class="item-icon" :style="{ borderColor: rarityColor() }">
      <i :class="`fa-solid ${item().icon}`" :style="{ color: rarityColor() }"></i>
    </div>
    <div class="item-name" :style="{ color: rarityColor() }">{{ item().name }}</div>
    <div v-if="qty !== undefined" class="item-qty">×{{ qty }}</div>
  </div>
</template>

<style scoped>
.item-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  min-width: 80px;
}

.item-card:hover {
  border-color: var(--border-hi);
  background: var(--bg-card-hi);
  transform: translateY(-1px);
}

.item-card.equipped {
  border-color: var(--success);
  box-shadow: 0 0 0 1px var(--success);
}

.item-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 4px;
  border-radius: var(--radius-sm);
  background: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
}

.item-icon i {
  font-size: 18px;
}

.item-name {
  font-size: 11px;
  font-weight: 600;
}

.item-qty {
  font-size: 10px;
  color: var(--text-faint);
  margin-top: 2px;
}
</style>
