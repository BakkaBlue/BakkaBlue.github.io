<script setup lang="ts">
import type { SkillId } from '@/data/skills'
import ProgressBar from './ProgressBar.vue'

defineProps<{
  skillId: SkillId
  icon: string
  name: string
  level: number
  xp: number
  xpNext: number
  xpPct: number
  currentActionName: string
  actionIcon: string
  yields: { icon: string; text: string }[]
  status: 'ready' | 'working' | 'paused' | 'locked'
  statusLabel: string
  favoriteTitle: string
  detailsTitle: string
  unlockText: string
  isFavorite: boolean
}>()

const emit = defineEmits<{
  click: []
  contextAction: [action: 'details' | 'favorite']
}>()

const statusColor: Record<string, string> = {
  ready: 'var(--success)',
  working: 'var(--gold)',
  paused: 'var(--xp)',
  locked: 'var(--danger)',
}
</script>

<template>
  <div
    class="skill-card"
    :class="[status, { favorite: isFavorite }]"
    @click="status !== 'locked' && emit('click')"
  >
    <!-- Header -->
    <div class="skill-card-head">
      <div class="skill-card-head-left">
        <div class="skill-icon" :class="status">
          <i class="fa-solid" :class="icon"></i>
        </div>
        <div class="skill-meta">
          <div class="skill-name">{{ name }}</div>
          <div class="skill-lv-row">
            <span class="skill-lv-badge">Lv.{{ level }}</span>
            <span
              class="skill-status-chip"
              :style="{ background: statusColor[status], color: '#1a1410' }"
            >
              <i
                v-if="status === 'working'"
                class="fa-solid fa-spin fa-spinner"
              ></i>
              <i v-else-if="status === 'locked'" class="fa-solid fa-lock"></i>
              <i
                v-else-if="status === 'paused'"
                class="fa-solid fa-pause"
              ></i>
              <i v-else class="fa-solid fa-check"></i>
              {{ statusLabel }}
            </span>
          </div>
        </div>
      </div>
      <div class="skill-card-head-right">
        <button
          class="icon-btn favorite-btn card-context-btn"
          :class="{ active: isFavorite }"
          :title="favoriteTitle"
          @click.stop="emit('contextAction', 'favorite')"
        >
          <i :class="isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
        </button>
        <button
          class="icon-btn detail-btn card-context-btn"
          :title="detailsTitle"
          @click.stop="emit('contextAction', 'details')"
        >
          <i class="fa-solid fa-ellipsis-v"></i>
        </button>
      </div>
    </div>

    <!-- XP Bar -->
    <div class="skill-card-body">
      <ProgressBar
        :progress="xpPct / 100"
        :label="`${xp.toLocaleString()} / ${xpNext.toLocaleString()} XP`"
        color="linear-gradient(90deg, #d35400, #f39c12)"
      />
    </div>

    <!-- Working State -->
    <div v-if="status === 'working'" class="skill-card-working">
      <div class="working-action">
        <i class="fa-solid" :class="actionIcon"></i>
        <span>{{ currentActionName }}</span>
      </div>
      <div v-if="yields.length > 0" class="working-yields">
        <div
          v-for="(y, idx) in yields"
          :key="idx"
          class="yield-item"
        >
          <i class="fa-solid" :class="y.icon"></i>
          <span>{{ y.text }}</span>
        </div>
      </div>
    </div>

    <!-- Locked State -->
    <div v-if="status === 'locked'" class="skill-card-locked">
      <i class="fa-solid fa-lock"></i>
      <span>{{ unlockText }}</span>
    </div>
  </div>
</template>

<style scoped>
.skill-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.skill-card:hover {
  border-color: var(--border-hi);
  background: var(--bg-card-hi);
  transform: translateY(-1px);
}

.skill-card.working {
  border-color: var(--gold);
  box-shadow: 0 0 0 1px var(--gold), 0 0 12px rgba(230, 181, 102, 0.15);
}

.skill-card.working:hover {
  transform: none;
}

.skill-card.locked {
  opacity: 0.55;
  filter: grayscale(0.7);
  cursor: not-allowed;
}

.skill-card.favorite {
  border-color: var(--gold-dim);
}

/* Header */
.skill-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  gap: 8px;
}

.skill-card-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.skill-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--bg-card-hi), var(--bg-base));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--gold-dim);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.skill-icon.working {
  color: var(--gold);
  border-color: var(--gold);
  animation: bobbing 1s infinite ease-in-out;
}

.skill-icon.locked {
  color: var(--text-faint);
}

.skill-meta {
  flex: 1;
  min-width: 0;
}

.skill-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skill-lv-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-lv-badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-dim);
  background: var(--bg-base);
  padding: 1px 8px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
}

.skill-status-chip {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.skill-status-chip i {
  font-size: 10px;
}

/* Header right */
.skill-card-head-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-faint);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-size: 12px;
}

.icon-btn:hover {
  background: var(--bg-base);
  border-color: var(--border);
  color: var(--text-dim);
}

.favorite-btn.active {
  color: var(--gold);
}

.favorite-btn.active:hover {
  color: var(--xp);
}

.card-context-btn {
  opacity: 0;
}

.skill-card:hover .card-context-btn {
  opacity: 1;
}

/* Body */
.skill-card-body {
  padding: 0 12px 12px;
}

/* Working */
.skill-card-working {
  padding: 6px 12px 10px;
  border-top: 1px solid var(--border);
  background: var(--bg-deep);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.working-action {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--gold);
}

.working-action i {
  font-size: 14px;
}

.working-yields {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.yield-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-dim);
}

.yield-item i {
  font-size: 10px;
  color: var(--success);
}

/* Locked */
.skill-card-locked {
  padding: 6px 12px 10px;
  border-top: 1px solid var(--border);
  background: var(--bg-deep);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-faint);
}

.skill-card-locked i {
  font-size: 14px;
  color: var(--danger);
}

/* Animations */
@keyframes bobbing {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style>
