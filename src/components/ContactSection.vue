<template>
  <section class="section page-shell">
    <header class="section-header">
      <p class="section-kicker">Contact</p>
      <h2 class="section-title">找到我</h2>
      <p class="section-desc">欢迎闲聊、提想法，或者只是路过打个招呼。</p>
    </header>

    <div class="grid">
      <a
        v-for="(link, i) in contactLinks"
        :key="link.label"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="card item reveal"
        :class="'reveal-delay-' + (i + 1)"
      >
        <span class="label">{{ link.label }}</span>
        <strong>{{ link.handle }}</strong>
        <span class="go">Open →</span>
      </a>
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
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  min-height: 120px;
  color: inherit;
}

.item:hover {
  transform: translateY(-2px);
}

.label {
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

strong {
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.go {
  margin-top: auto;
  color: var(--accent);
  font-size: 0.9rem;
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
