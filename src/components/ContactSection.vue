<template>
  <section class="section">
    <div class="section-inner">
      <h2 class="section-title">找到我</h2>
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
  width: 56px;
  height: 56px;
  font-size: 1.3rem;
  border-radius: 16px;
}
</style>
