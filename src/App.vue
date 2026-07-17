<template>
  <div class="app-shell">
    <FloatingShapes />
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
import { onMounted } from 'vue'
import FloatingShapes from './components/FloatingShapes.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import SkillCards from './components/SkillCards.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectCards from './components/ProjectCards.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
}

/* 全局渐变背景放在 body 上，通过变量控制 */
/* body 的背景在 variables.css 中设置 */
</style>
