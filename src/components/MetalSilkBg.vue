<template>
  <div class="ambient" aria-hidden="true">
    <div class="layer base"></div>
    <div class="layer glow glow-a"></div>
    <div class="layer glow glow-b"></div>
    <div class="layer glow glow-c"></div>
    <div class="layer film"></div>
    <div class="layer vignette"></div>
  </div>
</template>

<style scoped>
/*
  Premium ambient stage — inspired by high-end product/marketing sites:
  deep black, sparse soft light, slow drift, no glitter stripes.
*/
.ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: strict;
  background: #050505;
}

.layer {
  position: absolute;
  inset: 0;
}

.base {
  background:
    radial-gradient(120% 90% at 50% -10%, #141416 0%, transparent 55%),
    radial-gradient(90% 70% at 100% 100%, #0c0c0e 0%, transparent 50%),
    linear-gradient(180deg, #070708 0%, #050505 48%, #040404 100%);
}

/* large, soft luminance blooms — the “expensive” look */
.glow {
  width: 70vmax;
  height: 70vmax;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

.glow-a {
  top: -28vmax;
  left: -18vmax;
  background: radial-gradient(
    circle at 40% 40%,
    rgba(120, 124, 138, 0.28) 0%,
    rgba(80, 84, 96, 0.1) 38%,
    transparent 68%
  );
  animation: drift-a 42s ease-in-out infinite;
}

.glow-b {
  right: -24vmax;
  bottom: -22vmax;
  width: 75vmax;
  height: 75vmax;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(96, 100, 112, 0.22) 0%,
    rgba(60, 62, 72, 0.08) 42%,
    transparent 70%
  );
  animation: drift-b 54s ease-in-out infinite;
  animation-delay: -12s;
  opacity: 0.45;
}

.glow-c {
  top: 28%;
  left: 32%;
  width: 55vmax;
  height: 40vmax;
  background: radial-gradient(
    ellipse at center,
    rgba(160, 164, 176, 0.08) 0%,
    rgba(110, 114, 126, 0.03) 40%,
    transparent 70%
  );
  filter: blur(90px);
  animation: breath 26s ease-in-out infinite;
  animation-delay: -6s;
  opacity: 0.35;
}

/* microscopic grain, barely there — reads as material, not effect */
.film {
  opacity: 0.035;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

.vignette {
  background:
    radial-gradient(ellipse 85% 75% at 50% 40%, transparent 30%, rgba(0, 0, 0, 0.55) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, transparent 16%, transparent 84%, rgba(0, 0, 0, 0.4) 100%);
}

@keyframes drift-a {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.4;
  }
  40% {
    transform: translate3d(6%, 4%, 0) scale(1.06);
    opacity: 0.62;
  }
  70% {
    transform: translate3d(2%, 7%, 0) scale(1.03);
    opacity: 0.35;
  }
}

@keyframes drift-b {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.32;
  }
  35% {
    transform: translate3d(-5%, -3%, 0) scale(1.05);
    opacity: 0.5;
  }
  65% {
    transform: translate3d(-2%, -6%, 0) scale(1.02);
    opacity: 0.28;
  }
}

@keyframes breath {
  0%, 100% {
    opacity: 0.12;
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    opacity: 0.32;
    transform: translate3d(2%, -2%, 0) scale(1.08);
  }
}

@media (max-width: 768px) {
  .glow {
    filter: blur(60px);
  }

  .glow-c {
    display: none;
  }

  .film {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow-a,
  .glow-b,
  .glow-c {
    animation: none !important;
  }

  .glow-a {
    opacity: 0.45;
  }

  .glow-b {
    opacity: 0.35;
  }

  .glow-c {
    opacity: 0.18;
  }
}
</style>
