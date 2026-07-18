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
        <main>
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
import { defineAsyncComponent, nextTick, onMounted, onUnmounted, watch } from 'vue'
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

let observer: IntersectionObserver | null = null

function observeReveals() {
  observer?.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )

  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    observer?.observe(el)
  })
}

onMounted(async () => {
  await nextTick()
  observeReveals()
})

watch(isSettings, async (v) => {
  if (!v) {
    await nextTick()
    observeReveals()
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
}
</style>
