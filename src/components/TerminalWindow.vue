<template>
  <div
    ref="rootRef"
    class="term"
    :class="[{ focused, minimized }, accent]"
    :style="style"
    @pointerdown="focus"
  >
    <div class="term-bar" @pointerdown.stop="startDrag">
      <div class="dots" aria-hidden="true">
        <span class="dot red"></span>
        <span class="dot yellow" @click.stop="minimized = !minimized"></span>
        <span class="dot green"></span>
      </div>
      <div class="term-title">{{ title }}</div>
      <div class="term-bar-spacer"></div>
    </div>

    <div v-show="!minimized" class="term-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    x?: number
    y?: number
    w?: number
    z?: number
    accent?: 'cyan' | 'violet' | 'emerald' | 'amber'
  }>(),
  {
    title: 'bash',
    x: 40,
    y: 40,
    w: 420,
    z: 1,
    accent: 'cyan',
  },
)

const emit = defineEmits<{
  focus: []
  move: [payload: { x: number; y: number }]
}>()

const rootRef = ref<HTMLElement | null>(null)
const focused = ref(false)
const minimized = ref(false)
const pos = ref({ x: props.x, y: props.y })
const dragging = ref(false)
let start = { x: 0, y: 0, ox: 0, oy: 0 }

const style = computed(() => ({
  width: `${props.w}px`,
  transform: `translate3d(${pos.value.x}px, ${pos.value.y}px, 0)`,
  zIndex: String(props.z + (focused.value ? 20 : 0)),
}))

function focus() {
  focused.value = true
  emit('focus')
}

function startDrag(e: PointerEvent) {
  if (e.button !== 0) return
  focus()
  dragging.value = true
  start = { x: e.clientX, y: e.clientY, ox: pos.value.x, oy: pos.value.y }
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', endDrag)
}

function onMove(e: PointerEvent) {
  if (!dragging.value) return
  const nx = start.ox + (e.clientX - start.x)
  const ny = start.oy + (e.clientY - start.y)
  pos.value = { x: nx, y: ny }
  emit('move', pos.value)
}

function endDrag() {
  dragging.value = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', endDrag)
}

onUnmounted(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', endDrag)
})

defineExpose({
  setFocus(v: boolean) {
    focused.value = v
  },
  resetPosition() {
    pos.value = { x: props.x, y: props.y }
  },
})
</script>

<style scoped>
.term {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 14px;
  background: color-mix(in srgb, #0b1020 78%, transparent);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  backdrop-filter: blur(22px) saturate(140%);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
  overflow: hidden;
  user-select: none;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
  max-width: calc(100vw - 32px);
}

.term.focused {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--glass-border));
  box-shadow:
    var(--shadow),
    0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent),
    0 20px 50px rgba(0, 0, 0, 0.35);
}

.term.minimized {
  height: auto;
}

.term-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: grab;
}

.term-bar:active {
  cursor: grabbing;
}

.dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.85;
}

.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; cursor: pointer; }
.dot.green { background: #28c840; }

.term-title {
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.term-body {
  padding: 14px 14px 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Cascadia Code', monospace;
  font-size: 0.82rem;
  line-height: 1.65;
  color: var(--text-secondary);
  min-height: 120px;
  max-height: min(42vh, 360px);
  overflow: auto;
  user-select: text;
  cursor: text;
}

.term.cyan .term-body,
.term.violet .term-body,
.term.emerald .term-body,
.term.amber .term-body {
  --term-accent: var(--accent);
}

@media (max-width: 720px) {
  .term {
    position: relative !important;
    transform: none !important;
    width: 100% !important;
    left: auto !important;
    top: auto !important;
    margin-bottom: 12px;
  }
}
</style>
