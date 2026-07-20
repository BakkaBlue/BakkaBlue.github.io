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
  position: sticky;
  top: 48px;
  height: 1px;
  z-index: 24;
  pointer-events: none;
  margin: 0 0 10px;
  background: transparent;
  opacity: 0.7;
}

.scroll-progress__bar {
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  will-change: width;
}
</style>
