<template>
  <nav class="nav-bar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <a href="/" class="nav-brand" @click.prevent="onBrand">Cyan</a>
      <div class="nav-links">
        <a
          v-for="item in links"
          :key="item.href + item.label"
          :href="item.href"
          class="nav-link"
          @click="onLinkClick($event, item)"
        >{{ item.label }}</a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAppRoute } from '@/composables/useAppRoute'

const { isHome, goHome, goBlog } = useAppRoute()
const isScrolled = ref(false)

const homeLinks = [
  { label: '技能', href: '#skills', kind: 'hash' as const },
  { label: 'GitHub', href: '#github', kind: 'hash' as const },
  { label: '项目', href: '#projects', kind: 'hash' as const },
  { label: '博客', href: '/blog', kind: 'blog' as const },
  { label: '联系', href: '#contact', kind: 'hash' as const },
]

const otherLinks = [
  { label: '主页', href: '/', kind: 'home' as const },
  { label: '博客', href: '/blog', kind: 'blog' as const },
]

const links = computed(() => (isHome.value ? homeLinks : otherLinks))

function onScroll() {
  isScrolled.value = window.scrollY > 24
}

function onBrand() {
  goHome()
}

function onLinkClick(e: Event, item: { kind: string; href: string }) {
  if (item.kind === 'blog') {
    e.preventDefault()
    goBlog()
    return
  }
  if (item.kind === 'home') {
    e.preventDefault()
    goHome()
    return
  }
  // hash links: if not on home, go home first then scroll
  if (item.kind === 'hash' && !isHome.value) {
    e.preventDefault()
    goHome()
    window.setTimeout(() => {
      const id = item.href.slice(1)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.nav-bar {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: min(calc(100% - 32px), 1080px);
  z-index: 100;
  border-radius: 999px;
  background: transparent;
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid transparent;
  transition:
    background 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.nav-bar.scrolled {
  background: color-mix(in srgb, var(--glass-bg) 88%, transparent);
  border-color: var(--glass-border);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 22px;
}

.nav-brand {
  font-weight: 600;
  font-size: 0.98rem;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color 0.25s ease, background 0.25s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 760px) {
  .nav-links {
    display: none;
  }

  .nav-bar {
    top: 12px;
    width: calc(100% - 24px);
  }
}
</style>
