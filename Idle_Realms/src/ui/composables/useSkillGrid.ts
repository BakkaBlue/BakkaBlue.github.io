// src/ui/composables/useSkillGrid.ts
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { uiState } from '@/ui/state/UIState'
import { SKILLS } from '@/data/skills'

export function useSkillGrid() {
  const { t } = useI18n()

  const category = computed(() => uiState.currentCategory)

  // 过滤 + 排序（收藏在前）
  const skills = computed(() => {
    const filtered = SKILLS.filter(s => s.category === category.value)
    const favs = uiState.favorites
    return [...filtered].sort((a, b) => {
      const aFav = favs.includes(a.id)
      const bFav = favs.includes(b.id)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      return 0
    })
  })

  const title = computed(() =>
    category.value === 'noncombat'
      ? t('ui.skillGrid.noncombat')
      : t('ui.skillGrid.combat')
  )

  // 摘要统计（由外部通过 useSkillCard 填充）
  // 返回 skills 列表，调用方自行组装卡片
  return { category, skills, title }
}
