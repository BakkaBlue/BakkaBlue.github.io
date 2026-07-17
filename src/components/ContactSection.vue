<template>
  <section id="contact" class="section">
    <div class="section-inner">
      <h2 class="section-title glitch-title" data-text="找到我">找到我</h2>
      <div class="contact-row">
        <a
          v-for="link in contactLinks"
          :key="link.label"
          :href="link.url"
          :aria-label="link.label"
          :title="link.label"
          target="_blank"
          rel="noopener noreferrer"
          class="glass-icon-btn contact-icon"
        >
          <span class="contact-icon__ring" aria-hidden="true"></span>
          {{ link.icon }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const contactLinks = [
  { icon: '𝕏', label: 'Twitter', url: 'https://x.com/BakkaTheBlue' },
  { icon: '⬡', label: 'GitHub', url: 'https://github.com/BakkaBlue' },
  { icon: '▶', label: 'Bilibili', url: 'https://space.bilibili.com/23218601' },
  { icon: '◇', label: 'Discord', url: 'https://discord.gg/4XvsYHfk' },
]
</script>

<style scoped>
.contact-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-icon {
  position: relative;
  width: 60px;
  height: 60px;
  font-size: 1.35rem;
  border-radius: 18px;
  overflow: visible;
}

.contact-icon__ring {
  position: absolute;
  inset: -4px;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.contact-icon:hover .contact-icon__ring {
  opacity: 1;
  transform: scale(1);
  animation: ring-pulse 1.2s ease-out infinite;
}

@keyframes ring-pulse {
  0% { box-shadow: 0 0 0 0 var(--accent-glow); }
  100% { box-shadow: 0 0 0 12px transparent; }
}
</style>
