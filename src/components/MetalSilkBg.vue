<template>
  <div class="ambient" aria-hidden="true">
    <div class="layer base"></div>
    <div class="layer glow glow-a"></div>
    <div class="layer glow glow-b"></div>
    <div class="layer glow glow-c"></div>
    <div class="layer beam"></div>
    <div class="layer film"></div>
    <div class="layer vignette"></div>
  </div>
</template>

<style scoped>
/*
  Premium ambient stage with readable depth:
  still quiet/luxury, but highlights are visible at a glance.
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
    radial-gradient(110% 85% at 50% -8%, #1c1c20 0%, transparent 52%),
    radial-gradient(85% 70% at 100% 100%, #121216 0%, transparent 52%),
    radial-gradient(70% 55% at 0% 80%, #101014 0%, transparent 48%),
    linear-gradient(180deg, #0a0a0c 0%, #050505 50%, #040404 100%);
}

.glow {
  width: 72vmax;
  height: 72vmax;
  border-radius: 50%;
  filter: blur(70px);
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

/* primary highlight — top-left, clearly brighter */
.glow-a {
  top: -26vmax;
  left: -16vmax;
  background: radial-gradient(
    circle at 42% 40%,
    rgba(210, 214, 228, 0.42) 0%,
    rgba(150, 156, 176, 0.18) 32%,
    rgba(90, 94, 110, 0.06) 55%,
    transparent 72%
  );
  opacity: 0.85;
  animation: drift-a 36s ease-in-out infinite;
}

/* secondary counter-light — bottom-right */
.glow-b {
  right: -22vmax;
  bottom: -20vmax;
  width: 78vmax;
  height: 78vmax;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(170, 176, 196, 0.28) 0%,
    rgba(110, 116, 136, 0.12) 36%,
    rgba(70, 74, 88, 0.05) 58%,
    transparent 74%
  );
  opacity: 0.7;
  animation: drift-b 48s ease-in-out infinite;
  animation-delay: -10s;
}

/* center breath — keeps mid canvas from going flat black */
.glow-c {
  top: 22%;
  left: 28%;
  width: 58vmax;
  height: 42vmax;
  background: radial-gradient(
    ellipse at center,
    rgba(200, 204, 220, 0.16) 0%,
    rgba(130, 136, 156, 0.06) 42%,
    transparent 72%
  );
  filter: blur(80px);
  opacity: 0.55;
  animation: breath 22s ease-in-out infinite;
  animation-delay: -5s;
}

/* soft diagonal metal-silk highlight, intermittent but readable */
.beam {
  background: linear-gradient(
    118deg,
    transparent 0%,
    transparent 38%,
    rgba(255, 255, 255, 0.015) 46%,
    rgba(220, 224, 236, 0.08) 50%,
    rgba(255, 255, 255, 0.015) 54%,
    transparent 62%,
    transparent 100%
  );
  background-size: 220% 220%;
  mix-blend-mode: soft-light;
  opacity: 0;
  animation: beam-sweep 20s cubic-bezier(0.4, 0.05, 0.2, 1) infinite;
  filter: blur(1px);
}

.film {
  opacity: 0.04;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

/* lighter vignette so highlights remain visible */
.vignette {
  background:
    radial-gradient(ellipse 90% 80% at 50% 42%, transparent 42%, rgba(0, 0, 0, 0.38) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, transparent 14%, transparent 86%, rgba(0, 0, 0, 0.28) 100%);
}

@keyframes drift-a {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.7;
  }
  40% {
    transform: translate3d(5%, 3%, 0) scale(1.05);
    opacity: 0.95;
  }
  70% {
    transform: translate3d(2%, 6%, 0) scale(1.02);
    opacity: 0.62;
  }
}

@keyframes drift-b {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.55;
  }
  35% {
    transform: translate3d(-4%, -3%, 0) scale(1.04);
    opacity: 0.82;
  }
  65% {
    transform: translate3d(-2%, -5%, 0) scale(1.02);
    opacity: 0.5;
  }
}

@keyframes breath {
  0%, 100% {
    opacity: 0.28;
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    opacity: 0.62;
    transform: translate3d(2%, -2%, 0) scale(1.07);
  }
}

@keyframes beam-sweep {
  0% {
    background-position: 0% 40%;
    opacity: 0;
  }
  14% {
    opacity: 0.15;
  }
  28% {
    opacity: 0.55;
  }
  42% {
    opacity: 0.18;
  }
  58% {
    background-position: 55% 55%;
    opacity: 0.62;
  }
  74% {
    opacity: 0.12;
  }
  88% {
    opacity: 0.35;
  }
  100% {
    background-position: 100% 60%;
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .glow {
    filter: blur(55px);
  }

  .glow-c {
    opacity: 0.4;
  }

  .beam {
    animation-duration: 26s;
  }

  .film {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow-a,
  .glow-b,
  .glow-c,
  .beam {
    animation: none !important;
  }

  .glow-a { opacity: 0.85; }
  .glow-b { opacity: 0.65; }
  .glow-c { opacity: 0.45; }
  .beam {
    opacity: 0.22;
    background-position: 50% 50%;
  }
}
</style>
