<template>
  <div class="app-shell">
    <MetalSilkBg />
    <ScrollProgress />

    <div id="top">
      <NavBar />

      <main v-if="isHome">
        <HeroSection />
        <SkillCards />
        <GithubHeatmap />
        <ProjectCards />
        <BlogSection />
        <ContactSection />
      </main>

      <main v-else-if="isBlog">
        <BlogListPage />
      </main>

      <main v-else-if="isBlogPost">
        <BlogPostPage :slug="blogSlug" />
      </main>

      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, onUnmounted, watch } from 'vue'
import MetalSilkBg from './components/MetalSilkBg.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import { useAppRoute } from './composables/useAppRoute'

const SkillCards = defineAsyncComponent(() => import('./components/SkillCards.vue'))
const GithubHeatmap = defineAsyncComponent(() => import('./components/GithubHeatmap.vue'))
const ProjectCards = defineAsyncComponent(() => import('./components/ProjectCards.vue'))
const BlogSection = defineAsyncComponent(() => import('./components/BlogSection.vue'))
const ContactSection = defineAsyncComponent(() => import('./components/ContactSection.vue'))
const SiteFooter = defineAsyncComponent(() => import('./components/SiteFooter.vue'))
const BlogListPage = defineAsyncComponent(() => import('./components/BlogListPage.vue'))
const BlogPostPage = defineAsyncComponent(() => import('./components/BlogPostPage.vue'))

const { isHome, isBlog, isBlogPost, blogSlug } = useAppRoute()

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
    {
      threshold: [0, 0.05, 0.1],
      rootMargin: '120px 0px 120px 0px',
    },
  )
  return io
}

function observeEl(el: Element) {
  if (!(el instanceof HTMLElement)) return
  if (el.classList.contains('visible')) return
  if (observed.has(el)) return
  observed.add(el)
  ensureIo().observe(el)

  requestAnimationFrame(() => {
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh + 160 && rect.bottom > -160) {
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
          if (node.classList?.contains('reveal')) observeEl(node)
          scanReveals(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })
  }
}

function syncTitle() {
  if (isHome.value) document.title = 'Cyan · 个人主页'
  else if (isBlog.value) document.title = '博客 · Cyan'
}

onMounted(async () => {
  await nextTick()
  bootRevealSystem()
  syncTitle()
  window.setTimeout(() => scanReveals(), 0)
  window.setTimeout(() => scanReveals(), 300)
})

watch([isHome, isBlog, isBlogPost], async () => {
  syncTitle()
  await nextTick()
  scanReveals()
  window.setTimeout(() => scanReveals(), 100)
})

onUnmounted(() => {
  io?.disconnect()
  io = null
  mo?.disconnect()
  mo = null
})
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
}
</style>
