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
      { kind: 'out', text: 'explodemoji/' },
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
/*
  Target look: stacked floating windows with mild side yaw + light pitch,
  similar to the reference cards — soft shadow, rounded glass/black panels.
*/
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
  left: 18%;
  right: 12%;
  bottom: 10%;
  height: 28%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.18),
    transparent 72%
  );
  filter: blur(22px);
  opacity: 0.55;
  transform: translateY(12px) scale(1.05, 0.45);
  pointer-events: none;
}

.stack {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transform-style: flat;
  /* mild pitch + yaw; scaleY compensates rotateX compression */
  transform:
    translate3d(4px, 0, 0)
    rotateX(12deg)
    rotateY(-28deg)
    scaleY(1.12);
}

.term {
  --i: 0;
  position: absolute;
  width: min(96%, 560px);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--border-strong) 70%, transparent);
  background: color-mix(in srgb, #0b0b0d 92%, var(--bg-elevated));
  color: #f2f2f2;
  box-shadow:
    0 24px 50px rgba(0, 0, 0, 0.28),
    10px 12px 28px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  /* fan: each deeper card peeks top-right, slightly smaller */
  transform:
    translate(
      calc(var(--i) * 22px),
      calc(var(--i) * -18px)
    )
    scale(calc(1 - var(--i) * 0.03));
  opacity: calc(1 - var(--i) * 0.04);
  transition:
    transform 0.75s var(--ease-out),
    opacity 0.55s var(--ease-out),
    filter 0.55s var(--ease-out);
}

:global(html[data-theme='light']) .term {
  background: color-mix(in srgb, #111214 94%, #000);
  border-color: rgba(255, 255, 255, 0.08);
}

.term.queue {
  filter: saturate(0.96) brightness(0.98);
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
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
}

.dots {
  display: flex;
  gap: 7px;
}

.dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
  opacity: 0.9;
}

/* monochrome dots like the reference */
.dots .r,
.dots .y,
.dots .g {
  background: rgba(255, 255, 255, 0.55);
}

.title {
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.body {
  min-height: 210px;
  max-height: 240px;
  padding: 18px 20px 22px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 1.05rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.78);
  overflow: hidden;
}

.line { word-break: break-word; }
.line.cmd { color: rgba(255, 255, 255, 0.92); }
.line.ok { color: color-mix(in srgb, var(--success) 70%, white); }
.line.dim { color: rgba(255, 255, 255, 0.42); }
.line.out { color: rgba(255, 255, 255, 0.72); }

.prompt {
  color: rgba(255, 255, 255, 0.7);
  margin-right: 8px;
}

.caret {
  display: inline-block;
  margin-left: 1px;
  color: rgba(255, 255, 255, 0.8);
  animation: blink 1s steps(1) infinite;
}

.term.blue .prompt,
.term.blue .caret,
.term.violet .prompt,
.term.violet .caret,
.term.green .prompt,
.term.green .caret,
.term.amber .prompt,
.term.amber .caret {
  color: rgba(255, 255, 255, 0.78);
}

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
    transform: translate(12px, 230px) scale(0.96);
    opacity: 0;
    filter: blur(1px);
  }
}

.stage.reduced .stack {
  transform: none;
}

.stage.reduced .term {
  position: relative;
  width: min(98%, 620px);
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
    height: 470px;
  }

  .stack {
    transform:
      translate3d(0, 2px, 0)
      rotateX(11deg)
      rotateY(-24deg)
      scaleY(1.1);
  }

  .term {
    width: min(96%, 520px);
  }

  .body {
    font-size: 1rem;
    min-height: 190px;
  }
}

@media (max-width: 560px) {
  .stage {
    height: 400px;
  }

  .stack {
    transform:
      translate3d(0, 0, 0)
      rotateX(10deg)
      rotateY(-20deg)
      scaleY(1.08);
  }

  .term {
    width: min(98%, 430px);
  }

  .body {
    font-size: 0.92rem;
    min-height: 160px;
    max-height: 190px;
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
