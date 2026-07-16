<script setup lang="ts">
defineProps<{
  progress: number   // 0-1
  label?: string
  color?: string
}>()
</script>

<template>
  <div class="progress-wrap">
    <div class="progress-bg">
      <div
        class="progress-fill"
        :style="{ width: (progress * 100) + '%', background: color }"
      ></div>
    </div>
    <span v-if="label" class="progress-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bg {
  height: 10px;
  background: var(--bg-deep);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-dim), var(--gold));
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 11px;
  color: var(--text-dim);
}
</style>
