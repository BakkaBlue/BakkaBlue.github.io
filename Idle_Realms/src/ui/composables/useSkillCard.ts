// src/ui/composables/useSkillCard.ts
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameState } from '@/engine/state/GameState'
import { uiState } from '@/ui/state/UIState'
import { ViewType } from '@/engine/state/types'
import { getSkillConfig } from '@/data/skills'
import { startAction, stopAction } from '@/engine/systems/SkillSystem'
import { xpForLevel } from '@/engine/systems/ExperienceSystem'
import type { SkillId } from '@/data/skills'

export function useSkillCard(skillId: SkillId) {
  const { t } = useI18n()

  const cfg = computed(() => getSkillConfig(skillId))
  const state = computed(() => gameState.skills[skillId])

  // 锁定检查
  const isLocked = computed(() => {
    const cond = cfg.value?.unlockCondition
    if (!cond) return false
    return (gameState.skills[cond.skill]?.level ?? 0) < cond.level
  })

  // 工作中检查
  const isWorking = computed(() => {
    // Combat/Slayer 有专属的活跃状态
    if (skillId === 'combat') return gameState.combat.inBattle
    if (skillId === 'slayer') return gameState.slayer.activeTask !== null
    const ca = gameState.currentAction
    return ca !== null && ca.skill === skillId
  })

  // 状态
  const status = computed(() => {
    if (isLocked.value) return 'locked' as const
    if (isWorking.value) return 'working' as const
    // Paused 预留
    return 'ready' as const
  })

  // 收藏
  const isFavorite = computed(() => uiState.favorites.includes(skillId))

  // XP
  const xpNext = computed(() => xpForLevel(state.value.level))
  const xpPct = computed(() =>
    xpNext.value > 0 ? (state.value.xp / xpNext.value) * 100 : 0
  )

  // 可用动作
  const availableActions = computed(() =>
    cfg.value?.actions.filter(a => state.value.level >= a.levelReq) ?? []
  )

  // 当前动作
  const currentAction = computed(() => {
    if (!isWorking.value) return null
    const ca = gameState.currentAction!
    return cfg.value?.actions.find(a => a.id === ca.actionId) ?? null
  })

  // 收益
  const yields = computed(() => {
    const result: { icon: string; text: string }[] = []
    const action = currentAction.value
    if (!action || !isWorking.value) return result
    for (const [itemId, qty] of Object.entries(action.drops)) {
      const perHour = Math.round((qty / action.time) * 3600000)
      // "/hr" is a universal abbreviation, not user-facing text (P5 exemption)
      result.push({ icon: 'fa-cube', text: `+${perHour} ${t(`items.${itemId}`)}/hr` })
    }
    const xpPerHour = Math.round((action.xp / action.time) * 3600000)
    // "XP/hr" is a universal abbreviation, not user-facing text (P5 exemption)
    result.push({ icon: 'fa-star', text: `+${xpPerHour.toLocaleString()} XP/hr` })
    return result
  })

  // 解锁文本
  const unlockText = computed(() => {
    if (!isLocked.value) return ''
    const cond = cfg.value?.unlockCondition
    if (!cond) return ''
    return t('ui.skill.unlockHint', { skill: t(`skills.${cond.skill}`), level: cond.level })
  })

  // 切换
  function toggle() {
    if (isLocked.value) return
    if (isWorking.value) {
      stopAction()
      return
    }
    // Combat / Slayer → 导航到专属视图
    if (skillId === 'combat') {
      uiState.currentView = ViewType.Combat
      return
    }
    if (skillId === 'slayer') {
      uiState.currentView = ViewType.Slayer
      return
    }
    const best = availableActions.value[availableActions.value.length - 1]
    if (best) startAction(skillId, best.id)
  }

  // 详情
  function openDetail() {
    uiState.detailSkillId = skillId
    uiState.currentView = ViewType.SkillDetail
  }

  // 收藏
  function toggleFavorite() {
    const idx = uiState.favorites.indexOf(skillId)
    if (idx >= 0) {
      uiState.favorites.splice(idx, 1)
    } else if (uiState.favorites.length < 5) {
      uiState.favorites.push(skillId)
    }
  }

  return {
    cfg, state, isLocked, isWorking, status, isFavorite,
    xpNext, xpPct, availableActions, currentAction, yields, unlockText,
    toggle, openDetail, toggleFavorite,
  }
}
