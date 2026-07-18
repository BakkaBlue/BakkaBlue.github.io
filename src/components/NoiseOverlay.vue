<template>
  <div
    v-if="preset.noise"
    class="noise-overlay"
    :class="preset.noiseStrength"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
import { useStylePreset } from '@/composables/useStylePreset'

const { preset } = useStylePreset()
</script>

<style scoped>
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  mix-blend-mode: soft-light;
  contain: strict;
  /* smaller tile = cheaper paint */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 128px 128px;
}

@media (max-width: 768px) {
  .noise-overlay {
    display: none;
  }
}

.noise-overlay.soft {
  opacity: 0.025;
}

.noise-overlay.medium {
  opacity: 0.05;
}

:global([data-theme='dark']) .noise-overlay.soft {
  opacity: 0.035;
}

:global([data-theme='dark']) .noise-overlay.medium {
  opacity: 0.065;
}
</style>
