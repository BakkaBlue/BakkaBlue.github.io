<template>
  <div class="app-shell">
    <MetalSilkBg />
    <AppSidebar />

    <div class="main-frame">
      <AppTopbar />
      <ScrollProgress />

      <div class="content">
        <main :key="name" class="page-shell">
          <HeroSection v-if="isHome" />
          <SkillCards v-else-if="isSkills" />
          <GithubHeatmap v-else-if="isGithub" />
          <ProjectCards v-else-if="isProjects" />
          <BlogListPage v-else-if="isBlog" />
          <BlogPostPage v-else-if="isBlogPost" :slug="blogSlug" />
          <ContactSection v-else-if="isContact" />
        </main>
        <SiteFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, onUnmounted, watch } from 'vue'
import MetalSilkBg from './components/MetalSilkBg.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import HeroSection from './components/HeroSection.vue'
import { useAppRoute } from './composables/useAppRoute'
import { useTheme } from './composables/useTheme'

const SkillCards = defineAsyncComponent(() => import('./components/SkillCards.vue'))
const GithubHeatmap = defineAsyncComponent(() => import('./components/GithubHeatmap.vue'))
const ProjectCards = defineAsyncComponent(() => import('./components/ProjectCards.vue'))
const BlogListPage = defineAsyncComponent(() => import('./components/BlogListPage.vue'))
const BlogPostPage = defineAsyncComponent(() => import('./components/BlogPostPage.vue'))
const ContactSection = defineAsyncComponent(() => import('./components/ContactSection.vue'))
const SiteFooter = defineAsyncComponent(() => import('./components/SiteFooter.vue'))

const {
  name,
  isHome,
  isSkills,
  isGithub,
  isProjects,
  isBlog,
  isBlogPost,
  isContact,
  blogSlug,
  pageTitle,
} = useAppRoute()
useTheme()

let io: IntersectionObserver | null = null
let mo: MutationObserver | null = null
const observed = new WeakSet<Element>()

function ensureIo() {
  if (io) return io
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          entry.target.classList.add('visible')
          io?.unobserve(entry.target)
        }
      }
    },
    { threshold: [0, 0.05], rootMargin: '80px 0px' },
  )
  return io
}

function observeEl(el: Element) {
  if (!(el instanceof HTMLElement)) return
  if (el.classList.contains('visible') || observed.has(el)) return
  observed.add(el)
  ensureIo().observe(el)
  requestAnimationFrame(() => {
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || 800
    if (rect.top < vh + 120 && rect.bottom > -80) {
      el.classList.add('visible')
      io?.unobserve(el)
    }
  })
}

function scanReveals(root: ParentNode = document) {
  root.querySelectorAll?.('.reveal:not(.visible)').forEach((el) => observeEl(el))
}

function bootRevealSystem() {
  scanReveals()
  if (!mo) {
    mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.classList.contains('reveal')) observeEl(node)
          scanReveals(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })
  }
}

function syncTitle() {
  if (isBlogPost.value) return
  document.title = `${pageTitle.value} · Cyan`
}

onMounted(async () => {
  await nextTick()
  bootRevealSystem()
  syncTitle()
})

watch(name, async () => {
  syncTitle()
  await nextTick()
  scanReveals()
})

onUnmounted(() => {
  io?.disconnect()
  mo?.disconnect()
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  position: relative;
}

.main-frame {
  position: relative;
  z-index: 1;
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  padding: 0 28px 28px;
}

.content {
  max-width: var(--max-width);
  margin: 0 auto;
}

@media (max-width: 960px) {
  .main-frame {
    margin-left: 0;
    padding: 0 16px 24px;
  }
}
</style>
