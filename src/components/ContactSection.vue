<template>
  <section id="contact" class="section">
    <div class="section-inner contact-grid">
      <header class="section-header">
        <p class="section-kicker">Connect</p>
        <h2 class="section-title">找到我</h2>
        <p class="section-desc">欢迎闲聊、提想法，或者只是路过打个招呼。</p>
      </header>

      <div class="contact-links reveal">
        <a
          v-for="link in contactLinks"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-item glass-card"
        >
          <span class="contact-label">{{ link.label }}</span>
          <span class="contact-handle">{{ link.handle }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const contactLinks = [
  { label: 'Twitter', handle: '@BakkaTheBlue', url: 'https://x.com/BakkaTheBlue' },
  { label: 'GitHub', handle: 'BakkaBlue', url: 'https://github.com/BakkaBlue' },
  { label: 'Bilibili', handle: 'space/23218601', url: 'https://space.bilibili.com/23218601' },
  { label: 'Discord', handle: 'Join room', url: 'https://discord.gg/4XvsYHfk' },
]
</script>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 32px;
  align-items: start;
}

.contact-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 18px;
  text-decoration: none;
  color: inherit;
  border-radius: 20px;
}

.contact-label {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.contact-handle {
  color: var(--text-secondary);
  font-size: 0.98rem;
}

.contact-item:hover .contact-handle {
  color: var(--text-primary);
}

@media (max-width: 860px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .contact-links {
    grid-template-columns: 1fr;
  }
}
</style>
