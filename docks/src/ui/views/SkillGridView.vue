<script setup lang="ts">
import { useSkillGrid } from '@/ui/composables/useSkillGrid'
import { useSkillCard } from '@/ui/composables/useSkillCard'
import SkillCard from '@/ui/components/SkillCard.vue'
import { useI18n } from 'vue-i18n'
import { gameState } from '@/engine/state/GameState'

const { t } = useI18n()
const { skills, title } = useSkillGrid()

// 为每个技能创建 useSkillCard 实例
// 使用 Map 缓存 composable 实例
const cardInstances = new Map()

function getCard(skillId: string) {
  if (!cardInstances.has(skillId)) {
    cardInstances.set(skillId, useSkillCard(skillId as any))
  }
  return cardInstances.get(skillId)!
}
</script>

<template>
  <div class="skill-grid-view">
    <div class="grid-header">
      <h2 class="grid-title">{{ title }}</h2>
      <!-- SummaryBar 见下方 -->
    </div>

    <div class="skill-card-grid">
      <SkillCard
        v-for="s in skills"
        :key="s.id"
        :skill-id="s.id"
        :icon="s.icon"
        :name="t(`skills.${s.id}`)"
        :level="gameState.skills[s.id].level"
        :xp="getCard(s.id).xpNext.value ? gameState.skills[s.id].xp : 0"
        :xp-next="getCard(s.id).xpNext.value"
        :xp-pct="getCard(s.id).xpPct.value"
        :current-action-name="getCard(s.id).currentAction.value?.name ?? '--'"
        :action-icon="getCard(s.id).currentAction.value?.icon ?? s.icon"
        :yields="getCard(s.id).yields.value"
        :status="getCard(s.id).status.value"
        :status-label="t(`ui.skill.statusLabels.${getCard(s.id).status.value}`)"
        :favorite-title="getCard(s.id).isFavorite.value ? t('ui.skill.removeFavorite') : t('ui.skill.addFavorite')"
        :details-title="t('ui.skill.details')"
        :unlock-text="getCard(s.id).unlockText.value"
        :is-favorite="getCard(s.id).isFavorite.value"
        @click="getCard(s.id).toggle()"
        @context-action="(a) => a === 'details' ? getCard(s.id).openDetail() : getCard(s.id).toggleFavorite()"
      />
    </div>
  </div>
</template>

<style scoped>
.skill-grid-view {
  animation: fadeIn 0.2s ease;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}
.grid-header { margin-bottom: 20px; }
.grid-title {
  font-family: var(--font-title);
  font-size: 24px; font-weight: 700;
  color: var(--gold-hi); margin: 0 0 8px 0;
}
/* P2: 零媒体查询响应式 Grid */
.skill-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
</style>
