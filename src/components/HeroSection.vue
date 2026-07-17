<template>
  <section class="hero" ref="heroRef">
    <div class="hero-orb hero-orb-a" aria-hidden="true"></div>
    <div class="hero-orb hero-orb-b" aria-hidden="true"></div>

    <div class="hero-card glass-card" ref="cardRef" :style="tiltStyle">
      <div class="hero-spotlight" aria-hidden="true"></div>
      <div class="hero-badge">// SYSTEM ONLINE</div>
      <h1 class="hero-title">
        <span class="hero-title-static">你好，我是</span>
        <span class="hero-title-name">Cyren</span>
      </h1>
      <p class="hero-subtitle">
        <span class="type-text">{{ typed }}</span><span class="type-caret" aria-hidden="true">|</span>
      </p>
      <p class="hero-tagline">半吊子全栈 · AI 重度依赖者 · 野生硬件玩家</p>
      <div class="hero-socials">
        <a
          v-for="link in socialLinks"
          :key="link.label"
          :href="link.url"
          :aria-label="link.label"
          :title="link.label"
          target="_blank"
          rel="noopener noreferrer"
          class="glass-icon-btn hero-icon"
        >
          {{ link.icon }}
        </a>
      </div>
    </div>

    <div class="scroll-indicator" aria-hidden="true">
      <span class="scroll-mouse"></span>
      <span class="scroll-label">SCROLL</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCardTilt } from '@/composables/useCardTilt'
import { useTypewriter } from '@/composables/useTypewriter'

const cardRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const { style: tiltStyle } = useCardTilt(cardRef, 10)
const { text: typed } = useTypewriter([
  '探索代码、设计与智能硬件的边界',
  '用 AI 当轮椅，照样能冲出花活',
  '把奇奇怪怪的点子变成可点的页面',
  'Vue · 硬件 · 一点点赛博浪漫',
])

const socialLinks = [
  { icon: '𝕏', label: 'Twitter', url: 'https://x.com/BakkaTheBlue' },
  { icon: '⬡', label: 'GitHub', url: 'https://github.com/BakkaBlue' },
  { icon: '▶', label: 'Bilibili', url: 'https://space.bilibili.com/23218601' },
  { icon: '◇', label: 'Discord', url: 'https://discord.gg/4XvsYHfk' },
]
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 100px 24px 40px;
  overflow: hidden;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.55;
  animation: orb-pulse 8s ease-in-out infinite;
}

.hero-orb-a {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #3b82f6, transparent 70%);
  top: 18%;
  left: 12%;
}

.hero-orb-b {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, #8b5cf6, transparent 70%);
  bottom: 16%;
  right: 10%;
  animation-delay: -3s;
}

@keyframes orb-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.15); opacity: 0.7; }
}

.hero-card {
  position: relative;
  max-width: 720px;
  width: 100%;
  text-align: center;
  padding: 52px 44px;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  border: 1px solid transparent;
  background:
    linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box,
    linear-gradient(120deg, rgba(59,130,246,0.7), rgba(139,92,246,0.7), rgba(6,182,212,0.7), rgba(59,130,246,0.7)) border-box;
  background-size: 100% 100%, 300% 300%;
  animation: border-flow 8s linear infinite;
}

@keyframes border-flow {
  0% { background-position: 0 0, 0% 50%; }
  100% { background-position: 0 0, 300% 50%; }
}

.hero-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    420px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.16),
    transparent 45%
  );
  opacity: 0.9;
  mix-blend-mode: screen;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 18px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  box-shadow: 0 0 24px var(--accent-glow);
  animation: badge-glow 2.4s ease-in-out infinite;
}

@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 12px var(--accent-glow); }
  50% { box-shadow: 0 0 28px var(--accent-glow); }
}

.hero-title {
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.04em;
  margin-bottom: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  justify-content: center;
}

.hero-title-static {
  color: var(--text-primary);
}

.hero-title-name {
  background: linear-gradient(120deg, #60a5fa, #a78bfa, #22d3ee, #60a5fa);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: name-flow 5s ease infinite;
  text-shadow: 0 0 40px rgba(96, 165, 250, 0.25);
}

@keyframes name-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-subtitle {
  min-height: 2.2em;
  font-size: clamp(1.05rem, 2.4vw, 1.4rem);
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
}

.type-text {
  color: var(--text-secondary);
}

.type-caret {
  display: inline-block;
  margin-left: 2px;
  color: var(--accent);
  animation: caret-blink 0.9s steps(1) infinite;
}

@keyframes caret-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.hero-tagline {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.hero-socials {
  display: flex;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.hero-icon {
  width: 48px;
  height: 48px;
  font-size: 1.15rem;
  border-radius: 14px;
}

.scroll-indicator {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.scroll-mouse {
  width: 22px;
  height: 34px;
  border: 2px solid color-mix(in srgb, var(--text-muted) 80%, transparent);
  border-radius: 12px;
  position: relative;
}

.scroll-mouse::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 50%;
  width: 3px;
  height: 8px;
  border-radius: 2px;
  background: var(--accent);
  transform: translateX(-50%);
  animation: mouse-wheel 1.6s ease-in-out infinite;
}

@keyframes mouse-wheel {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
}

.scroll-label {
  font-size: 0.7rem;
  letter-spacing: 0.22em;
}

@media (max-width: 768px) {
  .hero-card {
    padding: 36px 22px;
  }
  .hero-orb {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-card,
  .hero-title-name,
  .hero-badge,
  .hero-orb,
  .type-caret,
  .scroll-mouse::after {
    animation: none !important;
  }
}
</style>
