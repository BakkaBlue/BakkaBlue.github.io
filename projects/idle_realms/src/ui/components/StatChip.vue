<script setup lang="ts">
defineProps<{
  icon: string
  value: string
  color?: string
}>()
</script>

<template>
  <div class="stat-chip">
    <i class="fa-solid" :class="icon" :style="{ color }"></i>
    <span>{{ value }}</span>
  </div>
</template>

<style scoped>
.stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
}

.stat-chip i {
  font-size: 12px;
}
</style>
