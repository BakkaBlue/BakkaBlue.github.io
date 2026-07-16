<script setup lang="ts">
import { ref, computed } from 'vue'
import { gameState } from '@/engine/state/GameState'
import { ENEMIES } from '@/data/monsters'
import { startBattle, getEnemyById, fleeBattle } from '@/engine/systems/CombatSystem'
import { getPlayerAtk, getPlayerDef } from '@/engine/systems/EquipmentSystem'
import { useI18n } from 'vue-i18n'
import { xpForLevel } from '@/engine/systems/ExperienceSystem'
import { eventBus } from '@/engine/events/EventBus'

const { t } = useI18n()

// ---- XP ----
const s = computed(() => gameState.skills.combat)
const xpNext = computed(() => xpForLevel(s.value.level))
const xpPct = computed(() => xpNext.value > 0 ? (s.value.xp / xpNext.value) * 100 : 0)

// ---- HP ----
const hpPct = computed(() => gameState.maxHp > 0 ? (gameState.hp / gameState.maxHp) * 100 : 0)
const enemyHpPct = computed(() => {
  if (!gameState.combat.inBattle || !gameState.combat.enemyMaxHp) return 100
  return (gameState.combat.enemyHp / gameState.combat.enemyMaxHp) * 100
})

// ---- 当前敌人 ----
const currentEnemy = computed(() => {
  if (!gameState.combat.enemyId) return null
  return getEnemyById(gameState.combat.enemyId) ?? null
})
const selectedEnemy = computed(() => ENEMIES.find(e => e.id === gameState.selectedEnemy))

// ---- 战斗日志 ----
interface CombatLogEntry { id: number; text: string; type: string }
const combatLog = ref<CombatLogEntry[]>([])
let logId = 0
function addLog(text: string, type: string) {
  combatLog.value.unshift({ id: logId++, text, type })
  if (combatLog.value.length > 30) combatLog.value.pop()
}
eventBus.on('combat:hit', (p) => {
  const { target, damage } = p as { target: string; damage: number }
  const name = currentEnemy.value?.name ?? t('common.unknown')
  addLog(target === 'enemy' ? t('ui.combat.hitPlayer', { name, damage }) : t('ui.combat.hitEnemy', { name, damage }), target === 'enemy' ? 'player' : 'enemy')
})
eventBus.on('combat:victory', (p) => {
  const { enemyName, gold, xp } = p as { enemyName: string; gold: number; xp: number }
  addLog(t('ui.combat.victory', { name: enemyName, gold, xp }), 'system')
})
eventBus.on('combat:defeat', (p) => {
  const { enemyName } = p as { enemyName: string }
  addLog(t('ui.combat.defeat', { name: enemyName }), 'system')
})
eventBus.on('combat:fled', (p) => {
  const { enemyName } = p as { enemyName: string }
  addLog(t('ui.combat.fled', { name: enemyName }), 'system')
})

// ---- 击中动画 ----
const playerFlinch = ref(false)
const enemyFlinch = ref(false)
eventBus.on('combat:hit', (p) => {
  const { target } = p as { target: string }
  if (target === 'player') { playerFlinch.value = true; setTimeout(() => playerFlinch.value = false, 300) }
  else { enemyFlinch.value = true; setTimeout(() => enemyFlinch.value = false, 300) }
})

// ---- 选敌即开战 ----
function selectAndFight(enemyId: string) {
  gameState.selectedEnemy = enemyId
  if (!gameState.combat.inBattle) {
    gameState.combat.autoBattle = true
    startBattle(enemyId)
  }
}

function onFlee() {
  fleeBattle()
}
</script>

<template>
  <div class="combat-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">{{ t('ui.pages.combat.title') }}</div>
      <div class="page-sub">{{ t('ui.pages.combat.sub') }}</div>
    </div>

    <!-- 技能总览卡片 -->
    <div class="skill-overview">
      <div class="skill-icon-big" style="color:var(--danger-hi)">
        <i class="fa-solid fa-khanda"></i>
      </div>
      <div class="skill-info">
        <div class="skill-name">{{ t('skills.combat') }} <span class="text-dim text-sm">Lv.{{ s.level }}</span></div>
        <div class="skill-level">{{ t('common.xp') }} <strong>{{ s.xp }}</strong> / {{ xpNext }}</div>
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: xpPct + '%' }"></div>
          <div class="xp-text">{{ s.xp }} / {{ xpNext }}</div>
        </div>
      </div>
    </div>

    <!-- 战斗区域 -->
    <div class="combat-arena">
      <!-- 战斗中 -->
      <div v-if="gameState.combat.inBattle && currentEnemy" class="combatants">
        <div class="combatant">
          <div class="combatant-avatar" :class="{ hit: playerFlinch }">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <div class="combatant-name">{{ t('ui.combat.playerName') }}</div>
          <div class="combatant-level">Lv.{{ s.level }} · {{ t('common.atk') }}{{ getPlayerAtk() }} {{ t('common.def') }}{{ getPlayerDef() }}</div>
          <div class="hp-bar-big">
            <div class="hp-bar-big-fill" :style="{ width: hpPct + '%' }"></div>
            <div class="hp-bar-big-text">{{ gameState.hp }} / {{ gameState.maxHp }}</div>
          </div>
        </div>
        <div class="vs-badge">VS</div>
        <div class="combatant enemy">
          <div class="combatant-avatar" :class="{ hit: enemyFlinch }">
            <i class="fa-solid" :class="currentEnemy.icon"></i>
          </div>
          <div class="combatant-name">{{ currentEnemy.name }}</div>
          <div class="combatant-level">Lv.{{ currentEnemy.levelReq }} · 攻{{ currentEnemy.atk }} 防{{ currentEnemy.def }}</div>
          <div class="hp-bar-big">
            <div class="hp-bar-big-fill" :style="{ width: enemyHpPct + '%' }"></div>
            <div class="hp-bar-big-text">{{ gameState.combat.enemyHp }} / {{ gameState.combat.enemyMaxHp }}</div>
          </div>
        </div>
      </div>

      <!-- 空闲预览 -->
      <div v-else class="combatants preview">
        <div class="combatant">
          <div class="combatant-avatar"><i class="fa-solid fa-user-shield"></i></div>
          <div class="combatant-name">{{ t('ui.combat.playerName') }}</div>
          <div class="combatant-level">Lv.{{ s.level }} · {{ t('common.atk') }}{{ getPlayerAtk() }} {{ t('common.def') }}{{ getPlayerDef() }}</div>
          <div class="hp-bar-big">
            <div class="hp-bar-big-fill" :style="{ width: hpPct + '%' }"></div>
            <div class="hp-bar-big-text">{{ gameState.hp }} / {{ gameState.maxHp }}</div>
          </div>
        </div>
        <div class="vs-badge">VS</div>
        <div class="combatant enemy">
          <div class="combatant-avatar">
            <i class="fa-solid" :class="selectedEnemy?.icon ?? 'fa-question'"></i>
          </div>
          <div class="combatant-name">{{ selectedEnemy?.name ?? t('ui.combat.selectTarget') }}</div>
          <div class="combatant-level" v-if="selectedEnemy">
            Lv.{{ selectedEnemy.levelReq }} · 攻{{ selectedEnemy.atk }} 防{{ selectedEnemy.def }}
          </div>
          <div v-if="selectedEnemy" class="hp-bar-big">
            <div class="hp-bar-big-fill" style="width:100%"></div>
            <div class="hp-bar-big-text">{{ selectedEnemy.hp }} / {{ selectedEnemy.hp }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗中控制 -->
    <div v-if="gameState.combat.inBattle" class="combat-controls">
      <button class="flee-btn" @click="onFlee">
        <i class="fa-solid fa-person-running"></i> {{ t('ui.combat.flee') }}
      </button>
      <label class="auto-check">
        <input type="checkbox" :checked="gameState.combat.autoBattle" @change="gameState.combat.autoBattle = !gameState.combat.autoBattle" />
        {{ t('ui.combat.autoBattle') }}
      </label>
      <label class="auto-check">
        <input type="checkbox" :checked="gameState.combat.autoFood" @change="gameState.combat.autoFood = !gameState.combat.autoFood" />
        {{ t('ui.combat.autoFood') }}
      </label>
    </div>

    <!-- 空闲时提示 -->
    <div v-else class="combat-controls">
      <span class="hint-text">{{ t('ui.combat.idleHint') }}</span>
    </div>

    <!-- 战斗日志 -->
    <div v-if="combatLog.length" class="combat-log">
      <div v-for="entry in combatLog" :key="entry.id" class="combat-log-entry" :class="entry.type">
        {{ entry.text }}
      </div>
    </div>

    <!-- 敌人选择 -->
    <div class="enemy-grid">
      <button
        v-for="enemy in ENEMIES"
        :key="enemy.id"
        class="enemy-card"
        :class="{
          selected: gameState.selectedEnemy === enemy.id,
          fighting: gameState.combat.inBattle && gameState.combat.enemyId === enemy.id,
          locked: gameState.skills.combat.level < enemy.levelReq,
        }"
        :disabled="gameState.skills.combat.level < enemy.levelReq"
        @click="selectAndFight(enemy.id)"
      >
        <i class="fa-solid" :class="enemy.icon"></i>
        <span class="enemy-name">{{ enemy.name }}</span>
        <span class="enemy-info" v-if="gameState.skills.combat.level < enemy.levelReq">
          {{ t('ui.skill.needLevel', { level: enemy.levelReq }) }}
        </span>
        <span class="enemy-info" v-if="gameState.skills.combat.level >= enemy.levelReq">
          HP {{ enemy.hp }} · ⭐{{ enemy.xp }} XP
        </span>
        <span class="enemy-info" v-if="gameState.skills.combat.level >= enemy.levelReq">
          {{ enemy.goldMin }}-{{ enemy.goldMax }} 💰
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.combat-view { animation: fadeIn 0.2s ease; }

/* === 页面标题 === */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.page-title {
  font-family: var(--font-title);
  font-size: 28px;
  font-weight: 700;
  color: var(--gold-hi);
  margin-bottom: 4px;
}

.page-sub {
  color: var(--text-dim);
  font-size: 13px;
}

/* === 技能总览 === */
.skill-overview {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.skill-icon-big {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--bg-card-hi), var(--bg-base));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: var(--gold);
  border: 1px solid var(--border-hi);
  flex-shrink: 0;
}

.skill-info { flex: 1; min-width: 0; }

.skill-name { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.skill-level { font-size: 13px; color: var(--text-dim); }
.skill-level strong { color: var(--gold); font-size: 16px; }
.text-dim { color: var(--text-dim); }
.text-sm { font-size: 13px; }

/* === XP 条 === */
.xp-bar {
  height: 14px;
  background: var(--bg-base);
  border-radius: 7px;
  overflow: hidden;
  margin-top: 6px;
  border: 1px solid var(--border);
  position: relative;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #d35400, #f39c12, #f1c40f);
  transition: width 0.4s ease;
  position: relative;
  overflow: hidden;
}

.xp-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s linear infinite;
}

.xp-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--text);
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  pointer-events: none;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* === 战斗区域 === */
.combat-arena {
  background: radial-gradient(ellipse at center, #3a2820 0%, transparent 70%), var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.combat-arena::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg, transparent 0 20px, rgba(0,0,0,0.05) 20px 40px);
  pointer-events: none;
}

.preview { opacity: 0.55; }

.combatants {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: center;
  position: relative;
}

.combatant { text-align: center; }

.combatant-avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-card-hi), var(--bg-base));
  border: 3px solid var(--border-hi);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: var(--gold);
  transition: transform 0.2s;
}

.combatant-avatar.hit { animation: shake 0.3s; }

.enemy .combatant-avatar { color: var(--danger-hi); border-color: #5a2825; }

.combatant-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.combatant-level { font-size: 11px; color: var(--gold); margin-bottom: 6px; }

/* === HP 条 === */
.hp-bar-big {
  height: 18px;
  background: var(--bg-base);
  border-radius: 9px;
  overflow: hidden;
  border: 1px solid var(--border);
  position: relative;
}

.hp-bar-big-fill {
  height: 100%;
  background: linear-gradient(90deg, #c62828, #ef5350);
  transition: width 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.2);
}

.hp-bar-big-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  pointer-events: none;
}

.vs-badge {
  font-family: var(--font-title);
  font-weight: 900;
  font-size: 24px;
  color: var(--gold);
  text-shadow: 0 0 20px rgba(230,181,102,0.5);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

/* === 战斗日志 === */
.combat-log {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  max-height: 120px;
  overflow-y: auto;
  font-size: 12px;
  margin-bottom: 12px;
}

.combat-log-entry { padding: 2px 0; color: var(--text-dim); animation: fadeIn 0.2s ease; }
.combat-log-entry.player { color: var(--success); }
.combat-log-entry.enemy { color: var(--danger-hi); }
.combat-log-entry.system { color: var(--gold); font-weight: 600; }

/* === 控制 === */
.combat-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  min-height: 32px;
}

.flee-btn {
  padding: 8px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-dim);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
}

.flee-btn:hover {
  border-color: var(--danger);
  color: var(--danger-hi);
  background: rgba(229,57,53,0.1);
}

.auto-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-dim);
  cursor: pointer;
  user-select: none;
}

.auto-check input { accent-color: var(--gold); }

.hint-text {
  font-size: 13px;
  color: var(--text-faint);
}

/* === 敌人卡片 === */
.enemy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.enemy-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-body);
}

.enemy-card:hover:not(:disabled) {
  border-color: var(--border-hi);
  background: var(--bg-card-hi);
  transform: translateY(-2px);
}

.enemy-card.selected {
  border-color: var(--gold);
  box-shadow: 0 0 12px rgba(230,181,102,0.15);
}

.enemy-card.fighting {
  border-color: var(--danger);
  box-shadow: 0 0 16px rgba(229,57,53,0.25);
  animation: pulse-border 1s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 8px rgba(229,57,53,0.15); }
  50% { box-shadow: 0 0 20px rgba(229,57,53,0.35); }
}

.enemy-card.locked {
  opacity: 0.35;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.enemy-card i { font-size: 26px; color: var(--danger); margin-bottom: 4px; }
.enemy-card.locked i { color: var(--text-faint); }
.enemy-name { font-size: 14px; font-weight: 600; }
.enemy-info { font-size: 10px; color: var(--text-dim); }
</style>
