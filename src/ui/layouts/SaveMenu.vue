<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSlotIndex, loadSlot, createNewSlot, deleteSlot, setCurrentSlot, type SlotMeta } from '@/engine/services/SaveSystem'

const { t } = useI18n()
const MAX_SLOTS = 3
const slots = ref<(SlotMeta | null)[]>([])

function refresh() {
  const index = getSlotIndex()
  slots.value = Array.from({ length: MAX_SLOTS }, (_, i) => index.find(s => s.id === i) ?? null)
}

function onEnter(slotId: number) {
  const ok = loadSlot(slotId)
  if (!ok) return
  setCurrentSlot(slotId)
  emit('enter-game')
}

function onNew(slotId: number) {
  createNewSlot(slotId)
  setCurrentSlot(slotId)
  emit('enter-game')
}

function onDelete(slotId: number) {
  if (!confirm(t('ui.saveMenu.deleteConfirm', { slot: slotId + 1 }))) return
  deleteSlot(slotId)
  refresh()
}

const emit = defineEmits<{ 'enter-game': [] }>()

onMounted(refresh)
</script>

<template>
  <div class="menu-view">
    <h1 class="logo"><i class="fa-solid fa-crown"></i> {{ t('ui.saveMenu.title') }}</h1>
    <h3 class="subtitle">{{ t('ui.saveMenu.subtitle') }}</h3>

    <div class="slot-list">
      <div
        v-for="(slot, i) in slots"
        :key="i"
        class="slot-card"
        :class="{ empty: !slot }"
      >
        <template v-if="slot">
          <div class="slot-info">
            <h4>{{ t('ui.saveMenu.slot') }} {{ i + 1 }}: {{ slot.name }}</h4>
            <p>
              {{ t('ui.saveMenu.totalLevel') }} {{ slot.totalLevel }} ·
              {{ t('ui.saveMenu.lastSave') }}: {{ new Date(slot.lastSave).toLocaleString('zh-CN') }}
            </p>
          </div>
          <div class="slot-actions">
            <button class="btn btn-primary" @click="onEnter(i)">{{ t('ui.saveMenu.enterGame') }}</button>
            <button class="btn btn-danger" @click="onDelete(i)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </template>
        <template v-else>
          <div class="slot-info">
            <h4>{{ t('ui.saveMenu.emptySlot') }} {{ i + 1 }}</h4>
            <p>{{ t('ui.saveMenu.newGameHint') }}</p>
          </div>
          <div class="slot-actions">
            <button class="btn" @click="onNew(i)"><i class="fa-solid fa-plus"></i> {{ t('ui.saveMenu.newSave') }}</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-view {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100vh; padding: 40px 20px;
}

.logo {
  font-family: var(--font-title); font-size: 36px; font-weight: 900;
  background: linear-gradient(180deg, var(--gold-hi), var(--gold-dim));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  margin-bottom: 8px; display: flex; align-items: center; gap: 12px;
}
.logo i { color: var(--gold); -webkit-text-fill-color: var(--gold); font-size: 32px; }

.subtitle { font-family: var(--font-title); color: var(--gold); font-size: 18px; margin-bottom: 24px; }

.slot-list { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 560px; }

.slot-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px;
  padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;
  transition: all 0.2s;
}
.slot-card:hover { border-color: var(--gold-dim); }
.slot-card.empty { border-style: dashed; opacity: 0.7; }

.slot-info h4 { font-size: 16px; color: var(--text); margin-bottom: 4px; }
.slot-info p { font-size: 12px; color: var(--text-dim); }

.slot-actions { display: flex; gap: 8px; }

.btn {
  padding: 10px 20px; background: var(--bg-card-hi); border: 1px solid var(--border-hi);
  color: var(--text); border-radius: 6px; font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-body);
}
.btn:hover { background: var(--bg-card); border-color: var(--gold-dim); }
.btn-primary { background: linear-gradient(180deg, var(--gold), var(--gold-dim)); border-color: var(--gold-dim); color: #1a1410; font-weight: 700; }
.btn-primary:hover { background: linear-gradient(180deg, var(--gold-hi), var(--gold)); }
.btn-danger { background: linear-gradient(180deg, var(--danger), #b71c1c); border-color: #b71c1c; color: white; }
.btn-danger:hover { opacity: 0.9; }
</style>
