<template>
  <div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress__bar" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)

function update() {
  const doc = document.documentElement
  const scrollTop = window.scrollY || doc.scrollTop
  const max = Math.max(1, doc.scrollHeight - window.innerHeight)
  progress.value = Math.min(100, (scrollTop / max) * 100)
}

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 200;
  pointer-events: none;
}

.scroll-progress__bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  box-shadow: 0 0 12px var(--accent-glow);
  transition: width 0.08s linear;
}
</style>
