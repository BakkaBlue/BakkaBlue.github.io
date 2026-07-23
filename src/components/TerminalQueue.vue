<template>
  <div class="stage" :class="{ reduced: reduced }" aria-hidden="true">
    <div class="floor"></div>
    <div class="stack">
      <div
        v-for="item in visible"
        :key="item.uid"
        class="term"
        :class="[item.phase, item.tone]"
        :style="{
          '--i': String(item.slot),
          zIndex: String(20 - item.slot),
        }"
      >
        <div class="bar">
          <span class="dots">
            <i class="r"></i><i class="y"></i><i class="g"></i>
          </span>
          <span class="title">{{ item.title }}</span>
        </div>
        <div class="body">
          <div
            v-for="(line, li) in item.shown"
            :key="li"
            class="line"
            :class="line.kind"
          >
            <template v-if="line.kind === 'cmd'">
              <span class="prompt">›</span>{{ line.text }}
            </template>
            <template v-else-if="line.kind === 'blank'">&nbsp;</template>
            <template v-else>{{ line.text }}</template>
          </div>
          <div v-if="item.phase === 'active' && item.typing" class="line cmd">
            <span class="prompt">›</span>{{ item.typing }}<span class="caret">▌</span>
          </div>
          <div
            v-else-if="item.phase === 'active' && item.done"
            class="line cmd"
          >
            <span class="prompt">›</span><span class="caret">▌</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

type LineKind = 'cmd' | 'out' | 'ok' | 'dim' | 'blank'
type Line = { kind: LineKind; text?: string }
type Tone = 'blue' | 'violet' | 'green' | 'amber'

interface Script {
  title: string
  tone: Tone
  lines: Line[]
}

interface TermItem {
  uid: number
  scriptIndex: number
  title: string
  tone: Tone
  phase: 'active' | 'fall' | 'queue'
  slot: number
  shown: Line[]
  typing: string
  done: boolean
}

const { reduced } = usePrefersReducedMotion()

const scripts: Script[] = [
  {
    title: 'cyan@home — zsh',
    tone: 'blue',
    lines: [
      { kind: 'cmd', text: 'whoami' },
      { kind: 'out', text: 'cyan' },
      { kind: 'cmd', text: 'cat ./about.md' },
      { kind: 'ok', text: '半吊子全栈 · AI 重度依赖者' },
      { kind: 'dim', text: 'status: building in public' },
    ],
  },
  {
    title: 'agent — claude',
    tone: 'violet',
    lines: [
      { kind: 'cmd', text: 'ask "做一个个人站"' },
      { kind: 'out', text: 'ok. keep it quiet and shippable.' },
      { kind: 'cmd', text: 'plan --mode=iterative' },
      { kind: 'ok', text: 'design → build → refine → deploy' },
      { kind: 'dim', text: 'human decides · model accelerates' },
    ],
  },
  {
    title: 'status — mon',
    tone: 'green',
    lines: [
      { kind: 'cmd', text: 'status --watch' },
      { kind: 'ok', text: 'focus   Web · AI · Hardware' },
      { kind: 'ok', text: 'stack   Vue / TS / Python' },
      { kind: 'ok', text: 'ship    small playable projects' },
      { kind: 'dim', text: 'agents: online' },
    ],
  },
  {
    title: 'projects — ls',
    tone: 'amber',
    lines: [
      { kind: 'cmd', text: 'ls ./projects' },
      { kind: 'out', text: 'idle_realms/' },
      { kind: 'out', text: 'color_wordle/' },
      { kind: 'out', text: 'laohei-music/' },
      { kind: 'dim', text: 'ready · open a folder' },
    ],
  },
]

const items = ref<TermItem[]>([])
let uidSeq = 1
let scriptCursor = 0
let alive = true
let timer: number | null = null

const visible = computed(() =>
  [...items.value]
    .filter((t) => t.phase !== 'fall' || true)
    .sort((a, b) => a.slot - b.slot || a.uid - b.uid),
)

function clearTimer() {
  if (timer !== null) {
    window.clearTimeout(timer)
    timer = null
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    timer = window.setTimeout(resolve, ms)
  })
}

function makeTerm(slot: number, phase: TermItem['phase'] = 'queue'): TermItem {
  const script = scripts[scriptCursor % scripts.length]
  scriptCursor += 1
  return reactive({
    uid: uidSeq++,
    scriptIndex: scriptCursor,
    title: script.title,
    tone: script.tone,
    phase,
    slot,
    shown: [],
    typing: '',
    done: false,
  }) as TermItem
}

function seed() {
  items.value = [
    makeTerm(0, 'active'),
    makeTerm(1, 'queue'),
    makeTerm(2, 'queue'),
  ]
}

async function typeActive(term: TermItem) {
  const script = scripts[(term.scriptIndex - 1) % scripts.length]
  const charMs = reduced.value ? 0 : 42
  const linePause = reduced.value ? 120 : 480

  term.shown = []
  term.typing = ''
  term.done = false

  for (const line of script.lines) {
    if (!alive || term.phase !== 'active') return
    if (line.kind === 'blank') {
      term.shown.push({ kind: 'blank' })
      await wait(linePause * 0.5)
      continue
    }
    if (line.kind === 'cmd') {
      const text = line.text || ''
      if (reduced.value || charMs === 0) {
        term.shown.push({ kind: 'cmd', text })
      } else {
        term.typing = ''
        for (let i = 1; i <= text.length; i++) {
          if (!alive || term.phase !== 'active') return
          term.typing = text.slice(0, i)
          await wait(charMs)
        }
        term.shown.push({ kind: 'cmd', text })
        term.typing = ''
      }
      await wait(linePause)
    } else {
      term.shown.push({ kind: line.kind, text: line.text })
      await wait(linePause * 0.85)
    }
  }

  term.done = true
  await wait(reduced.value ? 500 : 1400)
}

async function dropAndAdvance(active: TermItem) {
  if (active.phase !== 'active') return
  active.phase = 'fall'
  await wait(reduced.value ? 200 : 820)

  // remove fallen card
  items.value = items.value.filter((t) => t.uid !== active.uid)

  // shift remaining queue forward (1 -> 0 becomes active)
  for (const t of items.value) {
    t.slot = Math.max(0, t.slot - 1)
    if (t.slot === 0) {
      t.phase = 'active'
      t.shown = []
      t.typing = ''
      t.done = false
    } else {
      t.phase = 'queue'
    }
  }

  // keep three cards in the stack
  while (items.value.length < 3) {
    items.value.push(makeTerm(items.value.length, 'queue'))
  }
}

async function loop() {
  while (alive) {
    let active = items.value.find((t) => t.slot === 0)
    if (!active) {
      seed()
      await wait(40)
      continue
    }
    if (active.phase !== 'active') active.phase = 'active'
    await typeActive(active)
    if (!alive) return
    if (active.phase === 'active') {
      await dropAndAdvance(active)
    }
  }
}

onMounted(() => {
  alive = true
  seed()
  if (reduced.value) {
    const first = items.value[0]
    const script = scripts[0]
    first.shown = script.lines.map((l) => ({ ...l }))
    first.done = true
    first.phase = 'active'
    // keep queue visually stacked, no falling loop
    return
  }
  loop()
})

onUnmounted(() => {
  alive = false
  clearTimer()
})
</script>

<style scoped>
/* Floating stage — orthographic (no perspective foreshortening) */
.stage {
  position: relative;
  width: 100%;
  height: 520px;
  overflow: visible;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.floor {
  position: absolute;
  left: 14%;
  right: 8%;
  bottom: 8%;
  height: 38%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--text-primary) 10%, transparent),
    transparent 74%
  );
  filter: blur(16px);
  opacity: 0.28;
  transform: translateY(8px) scale(1.05, 0.55);
  pointer-events: none;
}

.stack {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  /* orthographic axonometric: yaw + elevation, no perspective */
  transform:
    translate3d(12px, 6px, 0)
    rotateX(-22deg)
    rotateY(-38deg);
  transform-style: flat;
}

.term {
  --i: 0;
  position: absolute;
  width: min(98%, 600px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-elevated) 96%, transparent);
  box-shadow:
    0 28px 56px rgba(0, 0, 0, 0.2),
    16px 12px 36px rgba(0, 0, 0, 0.08),
    0 1px 0 color-mix(in srgb, var(--text-primary) 8%, transparent) inset;
  /* screen-space stack only — no translateZ */
  transform:
    translate(
      calc(var(--i) * -22px),
      calc(var(--i) * -28px)
    )
    scale(calc(1 - var(--i) * 0.028));
  opacity: calc(1 - var(--i) * 0.1);
  transition:
    transform 0.75s var(--ease-out),
    opacity 0.55s var(--ease-out),
    filter 0.55s var(--ease-out);
}

.term.queue {
  filter: saturate(0.92) brightness(0.98);
}

.term.active {
  filter: none;
}

.term.fall {
  animation: fall-away 0.82s var(--ease-out) forwards;
  pointer-events: none;
}

.bar {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-soft) 88%, transparent);
}

.dots {
  display: flex;
  gap: 7px;
}

.dots i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: block;
}

.dots .r { background: #ff5f57; }
.dots .y { background: #febc2e; }
.dots .g { background: #28c840; }

.title {
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.88rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.body {
  min-height: 200px;
  max-height: 230px;
  padding: 18px 20px 20px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text-secondary);
  overflow: hidden;
}

.line { word-break: break-word; }
.line.cmd { color: var(--text-primary); }
.line.ok { color: color-mix(in srgb, var(--success) 80%, var(--text-primary)); }
.line.dim { color: var(--text-muted); }
.line.out { color: var(--text-secondary); }

.prompt {
  color: var(--accent);
  margin-right: 8px;
}

.caret {
  display: inline-block;
  margin-left: 1px;
  color: var(--accent);
  animation: blink 1s steps(1) infinite;
}

.term.blue .prompt,
.term.blue .caret { color: var(--accent); }
.term.violet .prompt,
.term.violet .caret { color: var(--accent-2); }
.term.green .prompt,
.term.green .caret { color: var(--success); }
.term.amber .prompt,
.term.amber .caret { color: var(--warning); }

@keyframes blink {
  50% { opacity: 0; }
}

@keyframes fall-away {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
    filter: blur(0);
  }
  35% {
    opacity: 0.9;
  }
  100% {
    transform: translate(10px, 240px) scale(0.94);
    opacity: 0;
    filter: blur(1px);
  }
}

.stage.reduced .stack {
  transform: none;
}

.stage.reduced .term {
  position: relative;
  width: min(98%, 640px);
  transform: none !important;
  opacity: 1 !important;
  animation: none !important;
}

.stage.reduced .term.queue,
.stage.reduced .term.fall {
  display: none;
}

@media (max-width: 980px) {
  .stage {
    height: 460px;
  }

  .stack {
    transform:
      translate3d(0, 6px, 0)
      rotateX(-18deg)
      rotateY(-32deg);
  }

  .term {
    width: min(94%, 540px);
  }

  .body {
    font-size: 1rem;
    min-height: 180px;
  }
}

@media (max-width: 560px) {
  .stage {
    height: 380px;
  }

  .stack {
    transform:
      translate3d(0, 4px, 0)
      rotateX(-14deg)
      rotateY(-26deg);
  }

  .term {
    width: min(96%, 420px);
  }

  .body {
    font-size: 0.92rem;
    min-height: 150px;
    max-height: 180px;
    padding: 14px 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .term {
    transition: none !important;
  }

  .term.fall {
    animation: none !important;
    opacity: 0;
  }

  .caret {
    animation: none;
  }
}
</style>
