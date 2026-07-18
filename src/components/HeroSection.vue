<template>
  <section class="hero">
    <div class="hero-stage">
      <!-- floating ambient label -->
      <div class="stage-label" aria-hidden="true">
        <span class="pulse"></span>
        cyan@desktop ~ ai session
      </div>

      <!-- MAIN intro terminal -->
      <TerminalWindow
        ref="winIntro"
        title="cyan@home — zsh"
        accent="cyan"
        :x="40"
        :y="48"
        :w="520"
        :z="zOrder.intro"
        @focus="bringFront('intro')"
      >
        <div class="lines">
          <div class="line dim">Last login: {{ loginTime }} on ttys001</div>
          <div v-for="(line, i) in introLines" :key="'i' + i" class="line" :class="line.kind">
            <template v-if="line.kind === 'cmd'">
              <span class="prompt">➜</span> <span class="path">~</span>
              <span class="cmd">{{ line.text }}</span>
            </template>
            <template v-else-if="line.kind === 'blank'"><br /></template>
            <template v-else>{{ line.text }}</template>
          </div>
          <div v-if="introTyping" class="line cmd">
            <span class="prompt">➜</span> <span class="path">~</span>
            <span class="cmd">{{ introTyping }}</span><span class="caret">▋</span>
          </div>
          <div v-else-if="introDone" class="line cmd">
            <span class="prompt">➜</span> <span class="path">~</span>
            <span class="caret">▋</span>
          </div>
        </div>
      </TerminalWindow>

      <!-- AI chat terminal -->
      <TerminalWindow
        ref="winAi"
        title="claude — agent"
        accent="violet"
        :x="420"
        :y="120"
        :w="460"
        :z="zOrder.ai"
        @focus="bringFront('ai')"
      >
        <div class="lines">
          <div class="line dim">connected · model: creative-desktop</div>
          <div v-for="(line, i) in aiLines" :key="'a' + i" class="line" :class="line.kind">
            <template v-if="line.kind === 'cmd'">
              <span class="who you">you</span>
              <span class="cmd">{{ line.text }}</span>
            </template>
            <template v-else-if="line.kind === 'ai'">
              <span class="who ai">ai</span>
              <span>{{ line.text }}</span>
            </template>
            <template v-else-if="line.kind === 'blank'"><br /></template>
            <template v-else>{{ line.text }}</template>
          </div>
          <div v-if="aiTyping" class="line" :class="aiTypingKind">
            <span class="who" :class="aiTypingKind === 'ai' ? 'ai' : 'you'">
              {{ aiTypingKind === 'ai' ? 'ai' : 'you' }}
            </span>
            <span>{{ aiTyping }}</span><span class="caret">▋</span>
          </div>
        </div>
      </TerminalWindow>

      <!-- status / stack terminal -->
      <TerminalWindow
        ref="winStatus"
        title="status — mon"
        accent="emerald"
        :x="80"
        :y="340"
        :w="360"
        :z="zOrder.status"
        @focus="bringFront('status')"
      >
        <div class="lines">
          <div v-for="(line, i) in statusLines" :key="'s' + i" class="line" :class="line.kind">
            <template v-if="line.kind === 'cmd'">
              <span class="prompt">$</span>
              <span class="cmd">{{ line.text }}</span>
            </template>
            <template v-else-if="line.kind === 'blank'"><br /></template>
            <template v-else>{{ line.text }}</template>
          </div>
          <div v-if="statusTyping" class="line cmd">
            <span class="prompt">$</span>
            <span class="cmd">{{ statusTyping }}</span><span class="caret">▋</span>
          </div>
        </div>
      </TerminalWindow>

      <!-- projects launcher terminal -->
      <TerminalWindow
        ref="winProjects"
        title="projects — ls"
        accent="amber"
        :x="500"
        :y="360"
        :w="380"
        :z="zOrder.projects"
        @focus="bringFront('projects')"
      >
        <div class="lines">
          <div class="line dim">~/workspace/cyan</div>
          <div v-for="(line, i) in projectLines" :key="'p' + i" class="line" :class="line.kind">
            <template v-if="line.kind === 'cmd'">
              <span class="prompt">$</span>
              <span class="cmd">{{ line.text }}</span>
            </template>
            <template v-else-if="line.kind === 'blank'"><br /></template>
            <template v-else>{{ line.text }}</template>
          </div>
          <div class="project-links" v-if="projectsDone">
            <a href="idle_realms/" class="plink">idle_realms/</a>
            <a href="color_wordle/" class="plink">color_wordle/</a>
            <a href="laohei-music/" class="plink">laohei-music/</a>
          </div>
        </div>
      </TerminalWindow>
    </div>

    <div class="hero-dock">
      <div class="dock-card glass-card">
        <p class="dock-kicker">AI-native desktop</p>
        <h1 class="dock-title">你好，我是 <span>Cyan</span></h1>
        <p class="dock-desc">
          半吊子全栈 · AI 重度依赖者 · 野生硬件玩家。
          拖动这些终端窗口，看看现在的工作台长什么样。
        </p>
        <div class="dock-actions">
          <a href="#projects" class="glass-btn">进入项目</a>
          <a href="#github" class="dock-link">GitHub 热力图</a>
          <button type="button" class="dock-link" @click="resetWindows">重置窗口</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TerminalWindow from './TerminalWindow.vue'
import { useTerminalLines, type TermLine } from '@/composables/useTerminalLines'
const winIntro = ref<{ setFocus: (v: boolean) => void; resetPosition: () => void } | null>(null)
const winAi = ref<{ setFocus: (v: boolean) => void; resetPosition: () => void } | null>(null)
const winStatus = ref<{ setFocus: (v: boolean) => void; resetPosition: () => void } | null>(null)
const winProjects = ref<{ setFocus: (v: boolean) => void; resetPosition: () => void } | null>(null)

const zOrder = ref({ intro: 3, ai: 2, status: 1, projects: 4 })

const loginTime = computed(() => {
  const d = new Date()
  return d.toDateString() + ' ' + d.toLocaleTimeString()
})

const introScript: TermLine[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'cyan' },
  { kind: 'cmd', text: 'cat ./about.md' },
  { kind: 'out', text: '# Cyan' },
  { kind: 'out', text: '半吊子全栈 · AI 重度依赖者 · 野生硬件玩家' },
  { kind: 'out', text: '把有趣的想法做成能点开的东西。' },
  { kind: 'cmd', text: 'echo "hello, internet"' },
  { kind: 'ok', text: 'hello, internet' },
]

const aiScript: TermLine[] = [
  { kind: 'cmd', text: '帮我做一个有创意的个人主页' },
  { kind: 'ai', text: '好。别做简历海报，做成可交互的桌面。' },
  { kind: 'ai', text: '几个可拖动的终端窗口，实时打印身份、状态和项目。' },
  { kind: 'cmd', text: '感觉很贴合现在的 AI 浪潮' },
  { kind: 'ai', text: '对。人机协作不是口号，是工作台本身。' },
  { kind: 'ai', text: '你负责审美和决策，我负责把花活落地。' },
]

const statusScript: TermLine[] = [
  { kind: 'cmd', text: 'status --watch' },
  { kind: 'ok', text: '● focus     Web · Hardware · AI' },
  { kind: 'ok', text: '● mode      building in public' },
  { kind: 'ok', text: '● stack     Vue / TS / Python' },
  { kind: 'ok', text: '● tools     Figma · ESP32 · HA' },
  { kind: 'dim', text: 'agents: online  |  caffeine: high' },
]

const projectsScript: TermLine[] = [
  { kind: 'cmd', text: 'ls ./projects' },
  { kind: 'out', text: 'idle_realms/     # 放置王国' },
  { kind: 'out', text: 'color_wordle/    # 颜色猜词' },
  { kind: 'out', text: 'laohei-music/    # 听听老黑' },
  { kind: 'cmd', text: 'open .' },
  { kind: 'dim', text: 'ready · click a folder' },
]

const {
  lines: introLines,
  typing: introTyping,
  done: introDone,
} = useTerminalLines(introScript, { startDelayMs: 300, charMs: 16, linePauseMs: 260 })

const {
  lines: aiLines,
  typing: aiTyping,
  typingKind: aiTypingKindRaw,
} = useTerminalLines(aiScript, { startDelayMs: 900, charMs: 14, linePauseMs: 320 })

const {
  lines: statusLines,
  typing: statusTyping,
} = useTerminalLines(statusScript, { startDelayMs: 1400, charMs: 12, linePauseMs: 220 })

const {
  lines: projectLines,
  done: projectsDone,
} = useTerminalLines(projectsScript, { startDelayMs: 1800, charMs: 14, linePauseMs: 240 })

const aiTypingKind = computed(() => aiTypingKindRaw.value ?? 'cmd')

function bringFront(id: keyof typeof zOrder.value) {
  const max = Math.max(...Object.values(zOrder.value))
  zOrder.value[id] = max + 1
  winIntro.value?.setFocus(id === 'intro')
  winAi.value?.setFocus(id === 'ai')
  winStatus.value?.setFocus(id === 'status')
  winProjects.value?.setFocus(id === 'projects')
}

function resetWindows() {
  winIntro.value?.resetPosition()
  winAi.value?.resetPosition()
  winStatus.value?.resetPosition()
  winProjects.value?.resetPosition()
  zOrder.value = { intro: 3, ai: 2, status: 1, projects: 4 }
}
</script>

<style scoped>
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 108px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-stage {
  position: relative;
  width: min(100%, 1100px);
  margin: 0 auto;
  height: min(62vh, 560px);
  min-height: 420px;
  border-radius: 28px;
  border: 1px solid var(--glass-border);
  background:
    radial-gradient(700px 320px at 20% 15%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%),
    radial-gradient(500px 280px at 80% 70%, rgba(124, 106, 214, 0.12), transparent 55%),
    color-mix(in srgb, var(--glass-bg) 70%, transparent);
  box-shadow: var(--shadow);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.stage-label {
  position: absolute;
  top: 14px;
  left: 18px;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  pointer-events: none;
}

.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6ee7b7;
  box-shadow: 0 0 0 0 rgba(110, 231, 183, 0.45);
  animation: live 2s ease-out infinite;
}

@keyframes live {
  0% { box-shadow: 0 0 0 0 rgba(110, 231, 183, 0.45); }
  70% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.line {
  word-break: break-word;
}

.line.cmd .cmd {
  color: var(--text-primary);
}

.line.out {
  color: var(--text-secondary);
}

.line.ok {
  color: color-mix(in srgb, #6ee7b7 80%, white 10%);
}

.line.dim {
  color: var(--text-muted);
}

.line.ai {
  color: color-mix(in srgb, var(--term-accent, var(--accent)) 85%, white 10%);
}

.prompt {
  color: #6ee7b7;
  margin-right: 6px;
}

.path {
  color: #7dd3fc;
  margin-right: 8px;
}

.who {
  display: inline-block;
  min-width: 28px;
  margin-right: 8px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.who.you { color: #fcd34d; }
.who.ai { color: #c4b5fd; }

.caret {
  display: inline-block;
  margin-left: 1px;
  color: var(--accent);
  animation: caret 1s steps(1) infinite;
}

@keyframes caret {
  50% { opacity: 0; }
}

.project-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.plink {
  color: #fcd34d;
  text-decoration: none;
  border-bottom: 1px dashed color-mix(in srgb, #fcd34d 35%, transparent);
  width: fit-content;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.plink:hover {
  color: #fde68a;
  border-color: #fde68a;
}

.hero-dock {
  width: min(100%, 1100px);
  margin: 0 auto;
}

.dock-card {
  padding: 22px 24px;
  border-radius: 22px;
}

.dock-kicker {
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}

.dock-title {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  letter-spacing: -0.03em;
  font-weight: 620;
  margin-bottom: 8px;
}

.dock-title span {
  background: linear-gradient(120deg, #dbe7ff 0%, #8eb6ff 45%, #b8a7ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dock-desc {
  color: var(--text-secondary);
  max-width: 62ch;
  line-height: 1.7;
  margin-bottom: 16px;
  font-size: 0.96rem;
}

.dock-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.dock-link {
  border: none;
  background: none;
  color: var(--text-secondary);
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
  padding: 0;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.dock-link:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-primary) 30%, transparent);
}

@media (max-width: 720px) {
  .hero {
    padding-top: 96px;
  }

  .hero-stage {
    height: auto;
    min-height: 0;
    padding: 42px 12px 12px;
    overflow: visible;
  }

  .stage-label {
    left: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret,
  .pulse {
    animation: none;
  }
}
</style>
