import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useTypewriter(
  phrases: string[],
  options: { typeMs?: number; deleteMs?: number; holdMs?: number } = {},
) {
  const { typeMs = 70, deleteMs = 35, holdMs = 1600 } = options
  const { reduced } = usePrefersReducedMotion()
  const text: Ref<string> = ref('')
  let phraseIndex = 0
  let charIndex = 0
  let deleting = false
  let timer: number | null = null
  let alive = true

  function clear() {
    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }
  }

  function tick() {
    if (!alive) return
    if (reduced.value) {
      text.value = phrases[0] ?? ''
      return
    }

    const current = phrases[phraseIndex] ?? ''
    if (!deleting) {
      charIndex = Math.min(charIndex + 1, current.length)
      text.value = current.slice(0, charIndex)
      if (charIndex === current.length) {
        timer = window.setTimeout(() => {
          deleting = true
          tick()
        }, holdMs)
        return
      }
      timer = window.setTimeout(tick, typeMs)
    } else {
      charIndex = Math.max(charIndex - 1, 0)
      text.value = current.slice(0, charIndex)
      if (charIndex === 0) {
        deleting = false
        phraseIndex = (phraseIndex + 1) % phrases.length
        timer = window.setTimeout(tick, typeMs)
        return
      }
      timer = window.setTimeout(tick, deleteMs)
    }
  }

  onMounted(() => {
    alive = true
    if (reduced.value) {
      text.value = phrases[0] ?? ''
      return
    }
    tick()
  })

  onUnmounted(() => {
    alive = false
    clear()
  })

  watch(reduced, (v) => {
    clear()
    if (v) {
      text.value = phrases[0] ?? ''
    } else {
      phraseIndex = 0
      charIndex = 0
      deleting = false
      tick()
    }
  })

  return { text }
}
