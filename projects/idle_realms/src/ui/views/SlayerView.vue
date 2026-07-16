<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { gameState } from '@/engine/state/GameState'
import {
  getAvailableMasters,
  getLockedMasters,
  acceptTask,
  skipTask,
  abandonTask,
  getSkipCost,
  getAvailableRewards,
  getPurchasedRewards,
  purchaseReward,
} from '@/engine/systems/SlayerSystem'
import ProgressBar from '@/ui/components/ProgressBar.vue'

const task = computed(() => gameState.slayer.activeTask)
const points = computed(() => gameState.slayer.points)
const tasksDone = computed(() => gameState.slayer.tasksCompleted)
const slayerLevel = computed(() => gameState.skills.slayer.level)

const masters = computed(() => getAvailableMasters())
const lockedMasters = computed(() => getLockedMasters())
const skipCost = computed(() => getSkipCost())
const availableRewards = computed(() => getAvailableRewards())
const purchasedRewards = computed(() => getPurchasedRewards())

const taskProgress = computed(() => {
  if (!task.value || task.value.requiredKills === 0) return 0
  return task.value.currentKills / task.value.requiredKills
})

function onAcceptTask(masterId: string) {
  acceptTask(masterId)
}

function onSkip() {
  skipTask()
}

function onAbandon() {
  abandonTask()
}

function onPurchase(rewardId: string) {
  purchaseReward(rewardId)
}
</script>

<template>
  <div class="slayer-view">
    <!-- 头部统计 -->
    <div class="header-row">
      <div class="stat-box">
        <span class="stat-icon">💀</span>
        <span class="stat-label">{{ t('ui.slayer.level') }}</span>
        <span class="stat-value">{{ slayerLevel }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-icon">⭐</span>
        <span class="stat-label">{{ t('ui.slayer.points') }}</span>
        <span class="stat-value">{{ points }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-icon">✅</span>
        <span class="stat-label">{{ t('ui.slayer.tasksCompleted') }}</span>
        <span class="stat-value">{{ tasksDone }}</span>
      </div>
    </div>

    <!-- 当前任务 -->
    <section class="panel">
      <h3>{{ t('ui.slayer.currentTask') }}</h3>

      <div v-if="task" class="active-task">
        <div class="task-header">
          <span class="task-master">{{ t('ui.slayer.taskSource', { master: task.masterId }) }}</span>
          <span class="task-progress-text">{{ task.currentKills }} / {{ task.requiredKills }}</span>
        </div>
        <p class="task-target">
          {{ t('ui.slayer.kill') }}<strong>{{ task.enemyName }}</strong>
        </p>
        <ProgressBar :progress="taskProgress" />
        <div class="task-rewards">
          <span>🏆 {{ task.xpReward }} 屠杀者 XP</span>
          <span>⭐ {{ task.pointReward }} 点数</span>
        </div>
        <div v-if="task.specialDrops && task.specialDrops.length" class="special-drops">
          <span v-for="d in task.specialDrops" :key="d.itemId" class="drop-tag">
            🎁 {{ d.name }}
          </span>
        </div>
        <div class="task-actions">
          <button class="btn btn-skip" @click="onSkip">🔄 跳过 ({{ skipCost }} 💰)</button>
          <button class="btn btn-abandon" @click="onAbandon">❌ 放弃</button>
        </div>
      </div>

      <div v-else class="no-task">
        <p>暂无任务，选择一个导师接取</p>
      </div>
    </section>

    <!-- 导师列表 -->
    <section class="panel">
      <h3>👤 屠杀者导师</h3>

      <div class="master-list">
        <div v-for="m in masters" :key="m.id" class="master-card">
          <div class="master-info">
            <i class="fa-solid" :class="m.icon"></i>
            <div>
              <div class="master-name">{{ m.name }}</div>
              <div class="master-desc">{{ m.description }}</div>
            </div>
          </div>
          <button
            class="btn btn-accept"
            :disabled="!!task"
            @click="onAcceptTask(m.id)"
          >
            接取任务
          </button>
        </div>

        <div v-for="m in lockedMasters" :key="m.id" class="master-card locked">
          <div class="master-info">
            <i class="fa-solid fa-lock"></i>
            <div>
              <div class="master-name">{{ m.name }}</div>
              <div class="master-desc">需要战斗等级 {{ m.combatReq }}</div>
            </div>
          </div>
          <span class="lock-req">🔒 战斗 Lv.{{ m.combatReq }}</span>
        </div>
      </div>
    </section>

    <!-- 奖励商店 -->
    <section class="panel">
      <h3>🏪 奖励商店</h3>

      <div v-if="!availableRewards.length && !purchasedRewards.length" class="no-task">
        <p>还没有可购买的奖励</p>
      </div>

      <div class="reward-list">
        <div v-for="r in purchasedRewards" :key="r.id" class="reward-card purchased">
          <i class="fa-solid" :class="r.icon"></i>
          <div class="reward-info">
            <div class="reward-name">{{ r.name }}</div>
            <div class="reward-desc">{{ r.description }}</div>
          </div>
          <span class="reward-badge">已购买</span>
        </div>

        <div v-for="r in availableRewards" :key="r.id" class="reward-card">
          <i class="fa-solid" :class="r.icon"></i>
          <div class="reward-info">
            <div class="reward-name">{{ r.name }}</div>
            <div class="reward-desc">{{ r.description }}</div>
            <div class="reward-req">需要屠杀者 Lv.{{ r.levelReq }}</div>
          </div>
          <button
            class="btn btn-buy"
            :disabled="points < r.cost"
            @click="onPurchase(r.id)"
          >
            ⭐ {{ r.cost }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.slayer-view {
  animation: fadeIn 0.2s ease;
  max-width: 800px;
}

.header-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.stat-icon { font-size: 22px; margin-bottom: 4px; }
.stat-label { font-size: 11px; color: var(--text-dim); }
.stat-value { font-size: 18px; font-weight: 700; color: var(--gold); margin-top: 2px; }

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 16px;
}

.panel h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dim);
  margin-bottom: 14px;
}

/* 当前任务 */
.active-task {
  text-align: center;
}

.task-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.task-target {
  font-size: 16px;
  margin-bottom: 12px;
}

.task-target strong { color: var(--gold); }

.task-rewards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-dim);
}

.special-drops {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.drop-tag {
  font-size: 11px;
  padding: 3px 10px;
  background: rgba(230, 181, 102, 0.1);
  border: 1px solid var(--gold-dim);
  border-radius: 10px;
  color: var(--gold);
}

.task-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
}

.no-task {
  text-align: center;
  padding: 24px;
  color: var(--text-faint);
}

/* 导师 */
.master-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.master-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  gap: 12px;
}

.master-card.locked {
  opacity: 0.5;
}

.master-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.master-info i {
  font-size: 24px;
  color: var(--gold);
  width: 28px;
  text-align: center;
}

.master-name {
  font-size: 14px;
  font-weight: 600;
}

.master-desc {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 2px;
}

.lock-req {
  font-size: 12px;
  color: var(--text-faint);
}

/* 奖励 */
.reward-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.reward-card.purchased {
  opacity: 0.6;
  border-color: var(--success);
}

.reward-card i {
  font-size: 20px;
  color: var(--gold);
  width: 24px;
  text-align: center;
}

.reward-info {
  flex: 1;
}

.reward-name {
  font-size: 13px;
  font-weight: 600;
}

.reward-desc {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 2px;
}

.reward-req {
  font-size: 10px;
  color: var(--text-faint);
  margin-top: 2px;
}

.reward-badge {
  font-size: 11px;
  padding: 4px 10px;
  background: rgba(124, 179, 66, 0.15);
  color: var(--success);
  border-radius: 10px;
}

/* 按钮 */
.btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  transition: all 0.15s;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-accept {
  background: var(--gold-dim);
  color: var(--bg-deep);
  border-color: var(--gold-dim);
}

.btn-accept:hover:not(:disabled) {
  background: var(--gold);
}

.btn-skip {
  background: var(--bg-card);
  color: var(--text-dim);
}

.btn-skip:hover { border-color: var(--border-hi); }

.btn-abandon {
  background: var(--bg-card);
  color: var(--danger);
}

.btn-abandon:hover {
  border-color: var(--danger);
  background: rgba(229, 57, 53, 0.1);
}

.btn-buy {
  background: var(--bg-card);
  color: var(--gold);
  white-space: nowrap;
}

.btn-buy:hover:not(:disabled) {
  border-color: var(--gold);
  background: rgba(230, 181, 102, 0.1);
}
</style>
