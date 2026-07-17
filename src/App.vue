<template>
  <div id="top" class="app-shell">
    <ParticleField />
    <FloatingShapes />
    <NoiseOverlay />
    <ScrollProgress />
    <CursorFx />
    <NavBar />

    <main>
      <HeroSection />
      <SkillCards />
      <AboutSection />
      <ProjectCards />
      <ContactSection />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted } from 'vue'
import FloatingShapes from './components/FloatingShapes.vue'
import ParticleField from './components/ParticleField.vue'
import NoiseOverlay from './components/NoiseOverlay.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CursorFx from './components/CursorFx.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import SkillCards from './components/SkillCards.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectCards from './components/ProjectCards.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'

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
