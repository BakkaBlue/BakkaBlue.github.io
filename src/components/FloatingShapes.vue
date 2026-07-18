<template>
  <div class="floating-shapes" aria-hidden="true">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>
</template>

<script setup lang="ts">
// ambient only
</script>

<style scoped>
.floating-shapes {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  contain: strict;
}

@media (max-width: 768px) {
  .floating-shapes .shape {
    filter: blur(70px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-shapes .shape {
    animation: none !important;
  }
}
</style>
