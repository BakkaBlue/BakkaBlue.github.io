<template>
  <aside class="sidebar" :class="{ open: mobileOpen }">
    <a class="brand" href="/" @click.prevent="navigate('/')">
      <span class="logo">C</span>
      <span class="brand-text">
        <strong>Cyan</strong>
        <small>Personal</small>
      </span>
    </a>

    <nav class="nav">
      <a
        v-for="item in links"
        :key="item.path"
        :href="item.path"
        class="nav-item"
        :class="{ active: isActive(item.name) }"
        @click.prevent="navigate(item.path)"
      >
        <span class="ico" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </a>
    </nav>

    <div class="side-note">
      <p>Build small. Ship often.</p>
    </div>
  </aside>

  <button
    class="mobile-toggle glass-icon-btn"
    type="button"
    :aria-label="mobileOpen ? '关闭菜单' : '打开菜单'"
    @click="mobileOpen = !mobileOpen"
  >
    {{ mobileOpen ? '✕' : '☰' }}
  </button>
  <div v-if="mobileOpen" class="scrim" @click="mobileOpen = false"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppRoute } from '@/composables/useAppRoute'

const { name, isBlogPost, go } = useAppRoute()
const mobileOpen = ref(false)

const links = [
  { name: 'home', path: '/', label: '总览', icon: '⌂' },
  { name: 'skills', path: '/skills', label: '技能', icon: '◎' },
  { name: 'github', path: '/github', label: 'GitHub', icon: '⌁' },
  { name: 'projects', path: '/projects', label: '项目', icon: '▤' },
  { name: 'blog', path: '/blog', label: '博客', icon: '✎' },
  { name: 'contact', path: '/contact', label: '联系', icon: '◇' },
] as const

function isActive(itemName: string) {
  if (itemName === 'blog') return name.value === 'blog' || isBlogPost.value
  return name.value === itemName
}

function navigate(path: string) {
  mobileOpen.value = false
  go(path)
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-w);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px 16px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
}

.logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(180deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000));
  box-shadow: 0 8px 18px var(--accent-glow);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-text strong {
  font-size: 0.98rem;
  letter-spacing: -0.02em;
}

.brand-text small {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  color: var(--text-secondary);
  transition: 0.25s var(--ease-out);
}

.nav-item:hover {
  background: var(--bg-soft);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}

.ico {
  width: 1.1em;
  text-align: center;
}

.side-note {
  padding: 12px;
  border-radius: 14px;
  background: var(--bg-soft);
  color: var(--text-muted);
  font-size: 0.82rem;
}

.mobile-toggle,
.scrim {
  display: none;
}

@media (max-width: 960px) {
  .sidebar {
    transform: translateX(-104%);
    transition: transform 0.35s var(--ease-out);
    box-shadow: var(--shadow);
  }

  .sidebar.open {
    transform: none;
  }

  .mobile-toggle {
    display: grid;
    position: fixed;
    top: 14px;
    left: 14px;
    z-index: 70;
  }

  .scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.28);
  }
}
</style>
