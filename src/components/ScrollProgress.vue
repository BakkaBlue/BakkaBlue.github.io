<template>
  <div class="scroll-progress" aria-hidden="true">
    <div ref="barRef" class="scroll-progress__bar"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const barRef = ref<HTMLElement | null>(null)
let ticking = false

function update() {
  ticking = false
  const bar = barRef.value
  if (!bar) return
  const doc = document.documentElement
  const scrollTop = window.scrollY || doc.scrollTop
  const max = Math.max(1, doc.scrollHeight - window.innerHeight)
  bar.style.width = Math.min(100, (scrollTop / max) * 100) + '%'
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 200;
  pointer-events: none;
}

.scroll-progress__bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.7;
  will-change: width;
}
</style>
