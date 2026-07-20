<template>
  <div class="ambient" aria-hidden="true">
    <div class="wash"></div>
    <div class="orb orb-a"></div>
    <div class="orb orb-b"></div>
  </div>
</template>

<style scoped>
.ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: var(--bg-base);
  transition: background-color 0.4s var(--ease-out);
}

.wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 80% at 10% -10%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 50%),
    radial-gradient(90% 70% at 100% 0%, color-mix(in srgb, var(--accent-2) 10%, transparent), transparent 48%);
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.45;
  will-change: transform, opacity;
}

.orb-a {
  width: 48vmax;
  height: 48vmax;
  top: -16vmax;
  left: -10vmax;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%);
  animation: float-a 28s ease-in-out infinite;
}

.orb-b {
  width: 42vmax;
  height: 42vmax;
  right: -12vmax;
  bottom: -14vmax;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent-2) 18%, transparent), transparent 72%);
  animation: float-b 34s ease-in-out infinite;
  animation-delay: -8s;
}

@keyframes float-a {
  0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.35; }
  50% { transform: translate3d(4%, 3%, 0); opacity: 0.55; }
}

@keyframes float-b {
  0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.28; }
  50% { transform: translate3d(-3%, -2%, 0); opacity: 0.48; }
}

@media (prefers-reduced-motion: reduce) {
  .orb-a, .orb-b { animation: none !important; opacity: 0.35; }
}
</style>
