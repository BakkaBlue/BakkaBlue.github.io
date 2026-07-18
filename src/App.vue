<template>
  <div class="app-shell">
    <MetalSilkBg />
    <ScrollProgress />

    <div id="top">
      <NavBar />
      <main>
        <HeroSection />
        <SkillCards />
        <GithubHeatmap />
        <ProjectCards />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, onUnmounted } from 'vue'
import MetalSilkBg from './components/MetalSilkBg.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'

const SkillCards = defineAsyncComponent(() => import('./components/SkillCards.vue'))
const GithubHeatmap = defineAsyncComponent(() => import('./components/GithubHeatmap.vue'))
const ProjectCards = defineAsyncComponent(() => import('./components/ProjectCards.vue'))
const ContactSection = defineAsyncComponent(() => import('./components/ContactSection.vue'))
const SiteFooter = defineAsyncComponent(() => import('./components/SiteFooter.vue'))

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

onMounted(async () => {
  await nextTick()
  bootRevealSystem()
  window.setTimeout(() => scanReveals(), 0)
  window.setTimeout(() => scanReveals(), 300)
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
