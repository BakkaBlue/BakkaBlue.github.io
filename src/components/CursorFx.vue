<template>
  <div v-show="enabled" ref="rootRef" class="cursor-fx" aria-hidden="true">
    <div ref="coreRef" class="cursor-core"></div>
    <div ref="ringRef" class="cursor-ring"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePointer } from '@/composables/usePointer'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { useStylePreset } from '@/composables/useStylePreset'

const pointer = usePointer()
const { reduced } = usePrefersReducedMotion()
const { preset } = useStylePreset()

const enabled = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const ringRef = ref<HTMLElement | null>(null)

let raf = 0
let running = false
let smoothX = 0
let smoothY = 0

function updateEnabled() {
  const fine = window.matchMedia('(pointer: fine)').matches
  const next = fine && !reduced.value && preset.value.cursor
  enabled.value = next
  document.documentElement.classList.toggle('has-custom-cursor', next)
  if (next) start()
  else stop()
}

function loop() {
  raf = 0
  if (!running || !enabled.value) return

  const core = coreRef.value
  const ring = ringRef.value
  if (!core || !ring) {
    schedule()
    return
  }

  smoothX += (pointer.x - smoothX) * 0.18
  smoothY += (pointer.y - smoothY) * 0.18

  const opacity = pointer.active ? '1' : '0'
  // direct DOM writes — no Vue reactive trail re-renders
  core.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
  core.style.opacity = opacity
  ring.style.transform = `translate3d(${smoothX}px, ${smoothY}px, 0)`
  ring.style.opacity = opacity

  schedule()
}

function schedule() {
  if (!running || raf) return
  raf = requestAnimationFrame(loop)
}

function start() {
  if (running || !enabled.value) return
  running = true
  smoothX = pointer.x
  smoothY = pointer.y
  schedule()
}

function stop() {
  running = false
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
}

function onVisibility() {
  if (document.hidden) stop()
  else if (enabled.value) start()
}

watch(
  () => [preset.value.cursor, reduced.value],
  () => updateEnabled(),
)

onMounted(() => {
  updateEnabled()
  document.addEventListener('visibilitychange', onVisibility)
})

onUnmounted(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
  document.documentElement.classList.remove('has-custom-cursor')
})
</script>

<style scoped>
.cursor-fx {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  contain: strict;
}

.cursor-core,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
  opacity: 0;
}

.cursor-core {
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: var(--accent);
  box-shadow: 0 0 18px var(--accent-glow);
}

.cursor-ring {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 1px solid color-mix(in srgb, var(--accent) 70%, transparent);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--accent) 16%, transparent),
    transparent 70%
  );
}
</style>
