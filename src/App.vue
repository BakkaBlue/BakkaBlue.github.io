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
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import FloatingShapes from './components/FloatingShapes.vue'
import ParticleField from './components/ParticleField.vue'
import NoiseOverlay from './components/NoiseOverlay.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CursorFx from './components/CursorFx.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import SkillCards from './components/SkillCards.vue'
import GithubHeatmap from './components/GithubHeatmap.vue'
import ProjectCards from './components/ProjectCards.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import SettingsPage from './components/SettingsPage.vue'
import { useAppRoute } from './composables/useAppRoute'
import { useStylePreset } from './composables/useStylePreset'

const { isSettings } = useAppRoute()
// boot style preset early
useStylePreset()

let observer: IntersectionObserver | null = null

function observeReveals() {
  observer?.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.14, rootMargin: '0px 0px -48px 0px' },
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
