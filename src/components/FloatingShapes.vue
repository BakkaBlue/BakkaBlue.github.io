<template>
  <div
    v-if="preset.shapes"
    class="floating-shapes"
    :class="preset.styleAttr"
    aria-hidden="true"
  >
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
    <div v-if="preset.styleAttr === 'max'" class="shape shape-4"></div>
  </div>
</template>

<script setup lang="ts">
import { useStylePreset } from '@/composables/useStylePreset'

const { preset } = useStylePreset()
</script>

<style scoped>
.floating-shapes {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.floating-shapes.max .shape {
  filter: blur(90px);
  opacity: calc(var(--shape-opacity) + 0.06);
}

.floating-shapes.glass .shape {
  filter: blur(130px);
  opacity: calc(var(--shape-opacity) * 0.85);
}
</style>
