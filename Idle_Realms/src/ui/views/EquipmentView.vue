<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameState } from '@/engine/state/GameState'
import { ITEMS, type EquipmentSlot } from '@/data/items'
import { unequipSlot, equipItem, getPlayerAtk, getPlayerDef } from '@/engine/systems/EquipmentSystem'
import ContextMenu from '@/ui/components/ContextMenu.vue'

const { t } = useI18n()
const ctxMenu = ref<InstanceType<typeof ContextMenu> | null>(null)

const slots: { key: EquipmentSlot; label: string }[] = [
  { key: 'weapon', label: t('ui.equipment.slots.weapon') },
  { key: 'helmet', label: t('ui.equipment.slots.helmet') },
  { key: 'body',   label: t('ui.equipment.slots.body') },
  { key: 'legs',   label: t('ui.equipment.slots.legs') },
  { key: 'boots',  label: t('ui.equipment.slots.boots') },
  { key: 'ring',   label: t('ui.equipment.slots.ring') },
  { key: 'amulet', label: t('ui.equipment.slots.amulet') },
]

// 快速装备弹出面板
const activeSlot = ref<EquipmentSlot | null>(null)
const equipSearch = ref('')

const candidatesForSlot = computed(() => {
  if (!activeSlot.value) return []
  const search = equipSearch.value.toLowerCase()
  return Object.keys(gameState.inventory)
    .filter(id => ITEMS[id]?.slot === activeSlot.value && gameState.inventory[id] > 0)
    .filter(id => !search || ITEMS[id]?.name.includes(search) || id.includes(search))
    .sort((a, b) => (ITEMS[b]?.atk ?? ITEMS[b]?.def ?? 0) - (ITEMS[a]?.atk ?? ITEMS[a]?.def ?? 0))
})

function openSlotPicker(slot: EquipmentSlot, e: MouseEvent) {
  e.preventDefault()
  activeSlot.value = activeSlot.value === slot ? null : slot
  equipSearch.value = ''
}

function quickEquip(itemId: string) {
  equipItem(itemId)
  activeSlot.value = null
}

function onEquippedRightClick(slot: EquipmentSlot, e: MouseEvent) {
  e.preventDefault()
  ctxMenu.value?.show(e.clientX, e.clientY, [
    { label: t('common.unequip'), icon: 'fa-arrow-down', action: () => unequipSlot(slot) },
    { label: t('ui.equipment.replace'), icon: 'fa-arrows-rotate', action: () => openSlotPicker(slot, e) },
    { label: t('common.cancel'), icon: 'fa-xmark', action: () => {} },
  ])
}

function onEmptySlotRightClick(slot: EquipmentSlot, e: MouseEvent) {
  e.preventDefault()
  openSlotPicker(slot, e)
}
</script>

<template>
  <div class="equipment-view">
    <div class="stat-summary">
      <span>⚔️ {{ t('common.atk') }}: {{ getPlayerAtk() }}</span>
      <span>🛡️ {{ t('common.def') }}: {{ getPlayerDef() }}</span>
    </div>

    <div class="slot-grid">
      <div v-for="slot in slots" :key="slot.key" class="slot-row">
        <div class="slot-label">{{ slot.label }}</div>
        <div class="slot-body">

          <!-- 已装备 -->
          <div
            v-if="gameState.equipment[slot.key]"
            class="equipped-item"
            @click="unequipSlot(slot.key)"
            @contextmenu="onEquippedRightClick(slot.key, $event)"
          >
            <i class="fa-solid" :class="ITEMS[gameState.equipment[slot.key]!]?.icon ?? 'fa-question'"></i>
            <span>{{ ITEMS[gameState.equipment[slot.key]!]?.name }}</span>
            <span class="eq-stat">
              <template v-if="ITEMS[gameState.equipment[slot.key]!]?.atk">⚔️+{{ ITEMS[gameState.equipment[slot.key]!]!.atk }}</template>
              <template v-if="ITEMS[gameState.equipment[slot.key]!]?.def">🛡️+{{ ITEMS[gameState.equipment[slot.key]!]!.def }}</template>
            </span>
          </div>

          <!-- 空槽 -->
          <div
            v-else
            class="empty-slot"
            @contextmenu="onEmptySlotRightClick(slot.key, $event)"
          >
            <i class="fa-solid fa-plus"></i>
            <span>{{ t('ui.equipment.emptyHint') }}</span>
          </div>

          <!-- 快速装备面板（该槽位） -->
          <div v-if="activeSlot === slot.key" class="slot-picker">
            <div class="picker-header">
              <input
                v-model="equipSearch"
                type="text"
                :placeholder="t('ui.equipment.searchPlaceholder')"
                class="picker-search"
                @click.stop
              />
              <button class="picker-close" @click="activeSlot = null">✕</button>
            </div>
            <div class="picker-list" v-if="candidatesForSlot.length">
              <div
                v-for="itemId in candidatesForSlot"
                :key="itemId"
                class="picker-item"
                :class="{ equipped: gameState.equipment[slot.key] === itemId }"
                @click="quickEquip(itemId)"
              >
                <i class="fa-solid" :class="ITEMS[itemId]?.icon ?? 'fa-question'"></i>
                <span class="picker-name">{{ ITEMS[itemId]?.name }}</span>
                <span class="picker-stat">
                  <template v-if="ITEMS[itemId]?.atk">⚔️+{{ ITEMS[itemId]!.atk }}</template>
                  <template v-if="ITEMS[itemId]?.def">🛡️+{{ ITEMS[itemId]!.def }}</template>
                </span>
                <span class="picker-qty">×{{ gameState.inventory[itemId] }}</span>
              </div>
            </div>
            <div v-else class="picker-empty">
              {{ equipSearch ? t('ui.equipment.noMatch') : t('ui.equipment.noAvailable') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <ContextMenu ref="ctxMenu" />
  </div>
</template>

<style scoped>
.equipment-view { animation: fadeIn 0.2s ease; }
.stat-summary { display: flex; gap: 24px; padding: 14px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 20px; font-size: 14px; font-weight: 600; }

.slot-grid { display: flex; flex-direction: column; gap: 6px; }
.slot-row { display: flex; gap: 12px; align-items: flex-start; }
.slot-label { width: 60px; min-width: 60px; padding: 10px 0; font-size: 13px; font-weight: 600; color: var(--gold); }
.slot-body { flex: 1; position: relative; }

/* 已装备 */
.equipped-item {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: rgba(124,179,66,0.12); border: 1px solid var(--success);
  border-radius: var(--radius-sm); font-size: 13px; color: var(--success); cursor: pointer; transition: all 0.15s;
}
.equipped-item:hover { background: rgba(124,179,66,0.2); }
.eq-stat { font-size: 11px; margin-left: auto; color: var(--xp); }

/* 空槽 */
.empty-slot {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: var(--bg-deep); border: 1px dashed var(--border);
  border-radius: var(--radius-sm); font-size: 12px; color: var(--text-faint); cursor: pointer; transition: all 0.15s;
}
.empty-slot:hover { border-color: var(--border-hi); color: var(--text-dim); }
.empty-slot i { font-size: 10px; }

/* 快速装备面板 */
.slot-picker {
  margin-top: 6px; background: var(--bg-card); border: 1px solid var(--border-hi);
  border-radius: var(--radius-md); overflow: hidden; animation: fadeIn 0.15s ease;
}
.picker-header { display: flex; gap: 6px; padding: 8px; border-bottom: 1px solid var(--border); background: var(--bg-base); }
.picker-search {
  flex: 1; background: var(--bg-deep); border: 1px solid var(--border); color: var(--text);
  padding: 6px 10px; border-radius: 4px; font-family: var(--font-body); font-size: 12px; outline: none;
}
.picker-search:focus { border-color: var(--gold); }
.picker-search::placeholder { color: var(--text-faint); }
.picker-close {
  width: 28px; height: 28px; background: transparent; border: 1px solid var(--border);
  color: var(--text-dim); border-radius: 4px; cursor: pointer; font-size: 12px;
  display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0;
}
.picker-close:hover { border-color: var(--danger); color: var(--danger); }

.picker-list { max-height: 160px; overflow-y: auto; padding: 4px; }
.picker-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 4px;
  cursor: pointer; transition: all 0.1s; font-size: 12px;
}
.picker-item:hover { background: var(--bg-card-hi); color: var(--gold-hi); }
.picker-item.equipped { opacity: 0.5; pointer-events: none; }
.picker-item i { width: 16px; text-align: center; color: var(--gold-dim); }
.picker-name { flex: 1; font-weight: 500; }
.picker-stat { font-size: 10px; color: var(--xp); }
.picker-qty { font-size: 10px; color: var(--text-faint); }
.picker-empty { padding: 16px; text-align: center; font-size: 12px; color: var(--text-faint); }
</style>
