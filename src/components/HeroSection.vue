<template>
  <section class="hero">
    <div class="hero-layout">
      <div class="hero-copy reveal visible">
        <p class="hero-kicker">Portfolio · 2024</p>
        <h1 class="hero-title">
          你好，我是
          <span class="hero-name">Cyan</span>
        </h1>
        <p class="hero-subtitle">
          <span>{{ typed }}</span><span class="caret" aria-hidden="true">|</span>
        </p>
        <p class="hero-desc">
          半吊子全栈 · AI 重度依赖者 · 野生硬件玩家。
          把有趣的想法做成能点开的东西。
        </p>
        <div class="hero-actions">
          <a href="#projects" class="glass-btn hero-cta">查看项目</a>
          <a href="#contact" class="hero-secondary">联系我</a>
        </div>
      </div>

      <div class="hero-panel glass-card reveal visible" :style="{ transitionDelay: '120ms' }">
        <div class="panel-row">
          <span class="panel-label">Focus</span>
          <span class="panel-value">Web · Hardware · AI</span>
        </div>
        <div class="panel-divider"></div>
        <div class="panel-row">
          <span class="panel-label">Status</span>
          <span class="panel-value panel-live"><i></i> Building in public</span>
        </div>
        <div class="panel-divider"></div>
        <div class="panel-row">
          <span class="panel-label">Links</span>
          <div class="panel-socials">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.url"
              :aria-label="link.label"
              :title="link.label"
              target="_blank"
              rel="noopener noreferrer"
              class="panel-social"
            >
              {{ link.icon }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-indicator" aria-hidden="true">
      <span class="scroll-line"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTypewriter } from '@/composables/useTypewriter'

const { text: typed } = useTypewriter(
  [
    '探索代码、设计与智能硬件的边界',
    '用克制的界面表达复杂的想法',
    '做有质感、可交付的小作品',
  ],
  { typeMs: 55, deleteMs: 28, holdMs: 1800 },
)

const socialLinks = [
  { icon: '𝕏', label: 'Twitter', url: 'https://x.com/BakkaTheBlue' },
  { icon: 'GH', label: 'GitHub', url: 'https://github.com/BakkaBlue' },
  { icon: 'B', label: 'Bilibili', url: 'https://space.bilibili.com/23218601' },
  { icon: 'D', label: 'Discord', url: 'https://discord.gg/4XvsYHfk' },
]
</script>

<style scoped>
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 140px 28px 100px;
}

.hero-layout {
  width: min(100%, var(--max-width));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 48px;
  align-items: center;
}

.hero-kicker {
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 22px;
  font-weight: 500;
}

.hero-title {
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  line-height: 1.08;
  letter-spacing: -0.045em;
  font-weight: 620;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.hero-name {
  display: inline-block;
  background: linear-gradient(120deg, #dbe7ff 0%, #8eb6ff 45%, #b8a7ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  min-height: 1.8em;
  font-size: clamp(1.05rem, 2vw, 1.28rem);
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.caret {
  display: inline-block;
  margin-left: 2px;
  color: var(--accent);
  opacity: 0.8;
  animation: caret 1s steps(1) infinite;
}

@keyframes caret {
  50% { opacity: 0; }
}

.hero-desc {
  max-width: 36ch;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.hero-cta {
  min-width: 132px;
}

.hero-secondary {
  color: var(--text-secondary);
  font-size: 0.95rem;
  border-bottom: 1px solid transparent;
  transition: color 0.25s ease, border-color 0.25s ease;
}

.hero-secondary:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-primary) 35%, transparent);
}

.hero-panel {
  padding: 28px;
  border-radius: 28px;
}

.panel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 42px;
}

.panel-label {
  color: var(--text-muted);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-value {
  color: var(--text-secondary);
  font-size: 0.95rem;
  text-align: right;
}

.panel-live {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.panel-live i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6ee7b7;
  box-shadow: 0 0 0 0 rgba(110, 231, 183, 0.4);
  animation: live 2s ease-out infinite;
}

@keyframes live {
  0% { box-shadow: 0 0 0 0 rgba(110, 231, 183, 0.45); }
  70% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.panel-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
  margin: 10px 0;
}

.panel-socials {
  display: flex;
  gap: 8px;
}

.panel-social {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}

.panel-social:hover {
  color: var(--text-primary);
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

.scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  opacity: 0.7;
}

.scroll-line {
  display: block;
  width: 1px;
  height: 42px;
  background: linear-gradient(to bottom, transparent, var(--accent), transparent);
}

@media (max-width: 900px) {
  .hero {
    padding-top: 120px;
    padding-bottom: 80px;
  }

  .hero-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .hero-panel {
    max-width: 480px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret,
  .panel-live i {
    animation: none;
  }
}
</style>
