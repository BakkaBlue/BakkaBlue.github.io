<script setup lang="ts">
import { ref } from 'vue'
import { eventBus } from '@/engine/events/EventBus'

interface ToastItem {
  id: number
  message: string
  type: string
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

eventBus.on('toast', (payload) => {
  const { message, type } = payload as { message: string; type: string }
  const id = nextId++
  toasts.value.push({ id, message, type: type ?? '' })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type"
      >
        {{ t.message }}
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  padding: 10px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border-hi);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  animation: slideInRight 0.3s ease;
  pointer-events: auto;
}

.toast.danger {
  border-color: var(--danger);
  color: var(--danger-hi);
}

.toast.success {
  border-color: var(--success);
  color: var(--success);
}
</style>
