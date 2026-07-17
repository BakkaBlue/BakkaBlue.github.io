<template>
  <div class="floating-shapes" aria-hidden="true">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>
</template>

<script setup lang="ts">
// 纯展示组件，无逻辑
</script>

<style scoped>
.floating-shapes {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
</style>
