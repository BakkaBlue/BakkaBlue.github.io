<template>
  <section class="hero">
    <div class="hero-card glass-card">
      <h1 class="hero-title">你好，我是 Cyren 👋</h1>
      <p class="hero-subtitle">探索代码、设计与智能硬件的边界</p>
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
    <div class="scroll-indicator" aria-hidden="true">↓</div>
  </section>
</template>

<script setup lang="ts">
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
}

.hero-card {
  max-width: 640px;
  width: 100%;
  text-align: center;
  padding: 48px 40px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.35rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
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
}

.hero-icon {
  width: 44px;
  height: 44px;
  font-size: 1.1rem;
  border-radius: 12px;
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
  .hero-card {
    padding: 32px 24px;
  }
}
</style>
