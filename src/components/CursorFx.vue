<template>
  <div v-if="enabled" class="cursor-fx" aria-hidden="true">
    <div class="cursor-core" :style="coreStyle"></div>
    <div class="cursor-ring" :style="ringStyle"></div>
    <div class="cursor-trail" v-for="(t, i) in trail" :key="i" :style="t"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { usePointer } from '@/composables/usePointer'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { useStylePreset } from '@/composables/useStylePreset'

const pointer = usePointer()
const { reduced } = usePrefersReducedMotion()
const { preset } = useStylePreset()
const enabled = ref(false)
const smooth = reactive({ x: 0, y: 0 })
const trail = ref<Array<Record<string, string>>>([])
let raf = 0

const coreStyle = computed(() => ({
  transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)`,
  opacity: pointer.active ? '1' : '0',
}))

const ringStyle = computed(() => ({
  transform: `translate3d(${smooth.x}px, ${smooth.y}px, 0)`,
  opacity: pointer.active ? '1' : '0',
}))

function updateEnabled() {
  const fine = window.matchMedia('(pointer: fine)').matches
  enabled.value = fine && !reduced.value && preset.value.cursor
  document.documentElement.classList.toggle('has-custom-cursor', enabled.value)
}

function loop() {
  if (enabled.value && !reduced.value) {
    smooth.x += (pointer.x - smooth.x) * 0.18
    smooth.y += (pointer.y - smooth.y) * 0.18

    const speed = Math.min(1, Math.hypot(pointer.vx, pointer.vy) / 40)
    if (pointer.active && speed > 0.08) {
      trail.value.unshift({
        transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0) scale(${0.4 + speed})`,
        opacity: String(0.35 * speed),
      })
      if (trail.value.length > 10) trail.value.pop()
    } else if (trail.value.length) {
      trail.value = trail.value.slice(0, -1)
    }
  }
  raf = requestAnimationFrame(loop)
}

watch(
  () => [preset.value.cursor, reduced.value],
  () => updateEnabled(),
)

onMounted(() => {
  updateEnabled()
  raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  document.documentElement.classList.remove('has-custom-cursor')
})
</script>

<style scoped>
.cursor-fx {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.cursor-core,
.cursor-ring,
.cursor-trail {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  will-change: transform, opacity;
  pointer-events: none;
}

.cursor-core {
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: var(--accent);
  box-shadow: 0 0 18px var(--accent-glow), 0 0 40px var(--accent-glow);
}

.cursor-ring {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 1px solid color-mix(in srgb, var(--accent) 70%, transparent);
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%);
  transition: opacity 0.2s ease;
}

.cursor-trail {
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  background: color-mix(in srgb, var(--accent) 55%, transparent);
  filter: blur(1px);
}
</style>
