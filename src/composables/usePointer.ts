import { reactive, onMounted, onUnmounted } from 'vue'

const pointer = reactive({
  x: 0,
  y: 0,
  nx: 0.5,
  ny: 0.5,
  vx: 0,
  vy: 0,
  active: false,
})

let prevX = 0
let prevY = 0
let attached = false
let count = 0

function onMove(e: PointerEvent) {
  pointer.vx = e.clientX - prevX
  pointer.vy = e.clientY - prevY
  prevX = e.clientX
  prevY = e.clientY
  pointer.x = e.clientX
  pointer.y = e.clientY
  pointer.nx = e.clientX / window.innerWidth
  pointer.ny = e.clientY / window.innerHeight
  pointer.active = true
}

function onLeave() {
  pointer.active = false
  pointer.vx = 0
  pointer.vy = 0
}

export function usePointer() {
  onMounted(() => {
    count += 1
    if (!attached) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
      attached = true
    }
  })

  onUnmounted(() => {
    count -= 1
    if (count <= 0 && attached) {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      attached = false
      count = 0
    }
  })

  return pointer
}
