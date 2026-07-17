<template>
  <footer class="site-footer">
    <div class="section-inner footer-inner">
      <p class="footer-text">© 2024 Cyren. Built with Vue + Glassmorphism + too much caffeine.</p>
      <p class="footer-sub">Particles · Magnetic Cursor · 3D Tilt · Typewriter · Glitch Titles</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 纯展示组件
</script>

<style scoped>
.site-footer {
  padding: 48px 24px 56px;
  position: relative;
  z-index: 1;
  text-align: center;
}

.footer-inner {
  border-top: 1px solid var(--glass-border);
  padding-top: 28px;
}

.footer-text {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.footer-sub {
  color: color-mix(in srgb, var(--text-muted) 80%, transparent);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
