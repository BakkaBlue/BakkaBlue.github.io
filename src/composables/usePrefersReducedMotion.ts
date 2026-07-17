import { ref, onMounted, onUnmounted } from 'vue'

export function usePrefersReducedMotion() {
  const reduced = ref(false)
  let mql: MediaQueryList | null = null

  function update() {
    reduced.value = !!mql?.matches
  }

  onMounted(() => {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mql.addEventListener('change', update)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', update)
  })

  return { reduced }
}
