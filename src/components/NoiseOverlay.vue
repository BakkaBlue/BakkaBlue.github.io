<template>
  <div class="noise-overlay" aria-hidden="true"></div>
</template>

<style scoped>
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  opacity: 0.025;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

[data-theme='dark'] .noise-overlay {
  opacity: 0.035;
}
</style>
