import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useCardTilt(elRef: Ref<HTMLElement | null>, maxTilt = 12) {
  const { reduced } = usePrefersReducedMotion()
  const style = ref({
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
    '--mx': '50%',
    '--my': '50%',
  } as Record<string, string>)

  function onMove(e: PointerEvent) {
    if (reduced.value || !elRef.value) return
    const rect = elRef.value.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * maxTilt
    const ry = (px - 0.5) * maxTilt
    style.value = {
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`,
      '--mx': `${px * 100}%`,
      '--my': `${py * 100}%`,
    }
  }

  function onLeave() {
    style.value = {
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      '--mx': '50%',
      '--my': '50%',
    }
  }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
  })

  onUnmounted(() => {
    const el = elRef.value
    if (!el) return
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  })

  return { style }
}
