// src/ui/composables/useDependencies.ts
import { computed } from 'vue'
import { getSkillConfig, SKILLS } from '@/data/skills'
import type { SkillId } from '@/data/skills'

export function useDependencies(skillId: SkillId) {
  const cfg = computed(() => getSkillConfig(skillId))
  const deps = computed(() => cfg.value?.dependencies)

  const consumes = computed(() => deps.value?.consumes ?? [])
  const produces = computed(() => deps.value?.produces ?? [])

  // requiredBy 自动推导 — 遍历所有技能，查找 consumes 中包含当前 skillId 的
  const requiredBy = computed(() =>
    SKILLS.filter(s =>
      s.dependencies?.consumes?.some(c => c.fromSkill === skillId)
    ).map(s => s.id)
  )

  return { consumes, produces, requiredBy }
}
