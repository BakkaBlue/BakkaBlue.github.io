import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type TermLine =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string }
  | { kind: 'ok'; text: string }
  | { kind: 'ai'; text: string }
  | { kind: 'dim'; text: string }
  | { kind: 'blank' }

export function useTerminalLines(
  script: TermLine[],
  options: { charMs?: number; linePauseMs?: number; startDelayMs?: number } = {},
) {
  const { charMs = 18, linePauseMs = 280, startDelayMs = 200 } = options
  const { reduced } = usePrefersReducedMotion()
  const lines: Ref<TermLine[]> = ref([])
  const typing: Ref<string> = ref('')
  const typingKind: Ref<'cmd' | 'ai' | null> = ref(null)
  const done = ref(false)
  let alive = true
  let timer: number | null = null

  function clear() {
    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }
  }

  function wait(ms: number) {
    return new Promise<void>((resolve) => {
      timer = window.setTimeout(() => resolve(), ms)
    })
  }

  async function run() {
    if (reduced.value) {
      lines.value = [...script]
      done.value = true
      return
    }

    await wait(startDelayMs)
    for (const line of script) {
      if (!alive) return
      if (line.kind === 'blank') {
        lines.value.push({ kind: 'blank' })
        await wait(linePauseMs * 0.5)
        continue
      }

      if (line.kind === 'cmd' || line.kind === 'ai') {
        typing.value = ''
        typingKind.value = line.kind
        for (let i = 1; i <= line.text.length; i++) {
          if (!alive) return
          typing.value = line.text.slice(0, i)
          await wait(charMs)
        }
        lines.value.push({ kind: line.kind, text: line.text })
        typing.value = ''
        typingKind.value = null
        await wait(linePauseMs)
      } else {
        lines.value.push(line)
        await wait(linePauseMs * 0.7)
      }
    }
    done.value = true
  }

  onMounted(() => {
    alive = true
    run()
  })

  onUnmounted(() => {
    alive = false
    clear()
  })

  return { lines, typing, typingKind, done }
}
