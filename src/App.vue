<template>
  <div class="app-shell">
    <ParticleField />
    <FloatingShapes />
    <NoiseOverlay />
    <ScrollProgress />
    <CursorFx />

    <template v-if="isSettings">
      <SettingsPage />
    </template>

    <template v-else>
      <div id="top">
        <NavBar />
        <main ref="mainRef">
          <HeroSection />
          <SkillCards />
          <GithubHeatmap />
          <ProjectCards />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import FloatingShapes from './components/FloatingShapes.vue'
import ParticleField from './components/ParticleField.vue'
import NoiseOverlay from './components/NoiseOverlay.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CursorFx from './components/CursorFx.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import { useAppRoute } from './composables/useAppRoute'
import { useStylePreset } from './composables/useStylePreset'

// below-the-fold / secondary routes — split chunks
const SkillCards = defineAsyncComponent(() => import('./components/SkillCards.vue'))
const GithubHeatmap = defineAsyncComponent(() => import('./components/GithubHeatmap.vue'))
const ProjectCards = defineAsyncComponent(() => import('./components/ProjectCards.vue'))
const ContactSection = defineAsyncComponent(() => import('./components/ContactSection.vue'))
const SiteFooter = defineAsyncComponent(() => import('./components/SiteFooter.vue'))
const SettingsPage = defineAsyncComponent(() => import('./components/SettingsPage.vue'))

const { isSettings } = useAppRoute()
useStylePreset()

const mainRef = ref<HTMLElement | null>(null)

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
      // generous margins so late-mounted async sections still get revealed
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

  // fallback: if already in/near viewport, force visible next frame
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

  // async components mount later — watch DOM for new .reveal nodes
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
  // one more pass after async chunks likely resolve
  window.setTimeout(() => scanReveals(), 0)
  window.setTimeout(() => scanReveals(), 300)
})

watch(isSettings, async (v) => {
  if (!v) {
    await nextTick()
    scanReveals()
    window.setTimeout(() => scanReveals(), 100)
  }
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
