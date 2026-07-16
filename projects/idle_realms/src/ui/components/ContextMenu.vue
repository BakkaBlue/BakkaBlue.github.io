<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface ContextMenuItem {
  label?: string
  icon?: string
  danger?: boolean
  divider?: boolean // 新增：是否为分割线
  action?: () => void
}

const visible = ref(false)
const x = ref(0)
const y = ref(0)
const items = ref<ContextMenuItem[]>([])
const menuRef = ref<HTMLElement | null>(null)

async function show(px: number, py: number, menuItems: ContextMenuItem[]) {
  if (menuItems.length === 0) return
  
  // 先设置初始坐标并显示，以便获取菜单实际尺寸
  x.value = px
  y.value = py
  items.value = menuItems
  visible.value = true

  // 等待 DOM 更新后进行边界检测
  await nextTick()
  if (menuRef.value) {
    const rect = menuRef.value.getBoundingClientRect()
    // 右侧溢出：向左偏移
    if (x.value + rect.width > window.innerWidth) {
      x.value = window.innerWidth - rect.width - 10
    }
    // 底部溢出：向上偏移
    if (y.value + rect.height > window.innerHeight) {
      y.value = window.innerHeight - rect.height - 10
    }
  }
}

function hide() {
  visible.value = false
}

function onItemClick(item: ContextMenuItem) {
  if (item.action) {
    item.action()
  }
  hide()
}

// 全局点击关闭
function onGlobalClick() { hide() }
function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') hide() }

onMounted(() => {
  document.addEventListener('click', onGlobalClick)
  document.addEventListener('keydown', onEsc)
})
onUnmounted(() => {
  document.removeEventListener('click', onGlobalClick)
  document.removeEventListener('keydown', onEsc)
})

// 暴露给外部调用
defineExpose({ show, hide })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="menuRef"
      class="context-menu"
      :style="{ left: x + 'px', top: y + 'px' }"
      @click.stop
    >
      <template v-for="(item, index) in items" :key="index">
        <div v-if="item.divider" class="ctx-divider"></div>
        <button
          v-else
          class="context-item"
          :class="{ danger: item.danger }"
          @click="onItemClick(item)"
        >
          <i class="fa-solid" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  background: var(--bg-card);
  border: 1px solid var(--border-hi);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: ctxIn 0.1s ease-out;
}

@keyframes ctxIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.context-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.1s;
  text-align: left;
  font-family: 'Noto Sans SC', sans-serif;
}

.context-item:hover {
  background: var(--bg-card-hi);
  color: var(--gold-hi);
}

.context-item i {
  width: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--gold-dim);
}

.context-item:hover i {
  color: var(--gold);
}

.context-item.danger {
  color: var(--danger);
}

.context-item.danger:hover {
  background: rgba(229, 56, 53, 0.267);
}

.context-item.danger i {
  color: var(--danger);
}

.ctx-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}
</style>