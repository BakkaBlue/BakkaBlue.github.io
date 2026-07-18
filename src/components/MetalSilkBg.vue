<template>
  <div class="metal-silk" aria-hidden="true">
    <div class="silk silk-base"></div>
    <div class="silk silk-fold-a"></div>
    <div class="silk silk-fold-b"></div>
    <div class="silk silk-sheen"></div>
    <div class="silk silk-pulse"></div>
    <div class="silk silk-vignette"></div>
  </div>
</template>

<style scoped>
.metal-silk {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: strict;
}

.silk {
  position: absolute;
  inset: -20%;
  will-change: transform, opacity, background-position;
}

/* deep graphite field with liquid metal ridges */
.silk-base {
  inset: 0;
  background:
    radial-gradient(ellipse 90% 60% at 20% 30%, rgba(70, 72, 82, 0.35), transparent 58%),
    radial-gradient(ellipse 80% 55% at 78% 68%, rgba(48, 50, 58, 0.4), transparent 55%),
    radial-gradient(ellipse 70% 50% at 55% 20%, rgba(90, 92, 102, 0.18), transparent 60%),
    linear-gradient(165deg, #050506 0%, #0b0b0e 45%, #070708 100%);
  opacity: 1;
}

/*
  satin folds: many soft silver bands, large background-size so motion feels liquid
*/
.silk-fold-a {
  background: repeating-linear-gradient(
    118deg,
    rgba(255, 255, 255, 0) 0px,
    rgba(255, 255, 255, 0) 42px,
    rgba(170, 172, 182, 0.018) 58px,
    rgba(230, 232, 240, 0.07) 72px,
    rgba(255, 255, 255, 0.12) 78px,
    rgba(200, 202, 212, 0.05) 86px,
    rgba(120, 122, 132, 0.02) 100px,
    rgba(255, 255, 255, 0) 120px,
    rgba(255, 255, 255, 0) 170px
  );
  background-size: 280% 280%;
  filter: blur(1.2px);
  mix-blend-mode: soft-light;
  opacity: 0.55;
  animation: silk-flow-a 28s ease-in-out infinite;
}

.silk-fold-b {
  background: repeating-linear-gradient(
    48deg,
    rgba(255, 255, 255, 0) 0px,
    rgba(255, 255, 255, 0) 50px,
    rgba(140, 142, 152, 0.02) 70px,
    rgba(210, 212, 222, 0.06) 88px,
    rgba(255, 255, 255, 0.1) 96px,
    rgba(180, 182, 192, 0.04) 108px,
    rgba(255, 255, 255, 0) 130px,
    rgba(255, 255, 255, 0) 190px
  );
  background-size: 320% 320%;
  filter: blur(2px);
  mix-blend-mode: overlay;
  opacity: 0.35;
  animation: silk-flow-b 36s ease-in-out infinite;
  animation-delay: -8s;
}

/* primary caustic sheen — appears and vanishes */
.silk-sheen {
  background:
    linear-gradient(
      105deg,
      transparent 0%,
      transparent 36%,
      rgba(255, 255, 255, 0.01) 44%,
      rgba(220, 222, 232, 0.08) 49%,
      rgba(255, 255, 255, 0.16) 50.5%,
      rgba(190, 192, 204, 0.07) 52%,
      rgba(255, 255, 255, 0.01) 58%,
      transparent 68%,
      transparent 100%
    ),
    radial-gradient(
      ellipse 45% 30% at 50% 50%,
      rgba(240, 240, 248, 0.1),
      transparent 70%
    );
  background-size: 180% 180%, 120% 120%;
  mix-blend-mode: screen;
  filter: blur(0.6px);
  opacity: 0;
  animation: silk-sheen 18s cubic-bezier(0.45, 0.05, 0.2, 1) infinite;
}

/* secondary delayed bloom so the fabric “breathes” */
.silk-pulse {
  background:
    radial-gradient(ellipse 55% 40% at 30% 40%, rgba(200, 202, 214, 0.09), transparent 62%),
    radial-gradient(ellipse 50% 35% at 72% 58%, rgba(170, 172, 184, 0.07), transparent 65%);
  mix-blend-mode: soft-light;
  opacity: 0;
  animation: silk-pulse 24s ease-in-out infinite;
  animation-delay: -6s;
}

/* keep edges ink-black so content stays grounded */
.silk-vignette {
  inset: 0;
  background:
    radial-gradient(ellipse 85% 75% at 50% 45%, transparent 35%, rgba(0, 0, 0, 0.45) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 18%, transparent 82%, rgba(0, 0, 0, 0.35) 100%);
  opacity: 1;
}

@keyframes silk-flow-a {
  0% {
    background-position: 0% 30%;
    transform: translate3d(-2%, -1%, 0) scale(1.02) rotate(-1.5deg);
    opacity: 0.25;
  }
  25% {
    opacity: 0.7;
  }
  50% {
    background-position: 55% 70%;
    transform: translate3d(1.5%, 1%, 0) scale(1.05) rotate(1deg);
    opacity: 0.4;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    background-position: 100% 40%;
    transform: translate3d(-1%, 0.5%, 0) scale(1.02) rotate(-1.5deg);
    opacity: 0.3;
  }
}

@keyframes silk-flow-b {
  0% {
    background-position: 100% 20%;
    transform: translate3d(2%, 1%, 0) scale(1.04) rotate(2deg);
    opacity: 0.2;
  }
  40% {
    opacity: 0.55;
  }
  50% {
    background-position: 40% 80%;
    transform: translate3d(-1.5%, -1%, 0) scale(1.06) rotate(-1deg);
    opacity: 0.35;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    background-position: 0% 50%;
    transform: translate3d(1%, 0.5%, 0) scale(1.04) rotate(2deg);
    opacity: 0.22;
  }
}

@keyframes silk-sheen {
  0% {
    background-position: -30% 40%, 40% 50%;
    opacity: 0;
    transform: translate3d(-8%, 0, 0) rotate(6deg) scale(1.1);
  }
  10% {
    opacity: 0;
  }
  22% {
    opacity: 0.55;
  }
  38% {
    opacity: 0.18;
  }
  52% {
    background-position: 50% 55%, 55% 45%;
    opacity: 0.65;
    transform: translate3d(0, -2%, 0) rotate(6deg) scale(1.12);
  }
  68% {
    opacity: 0.12;
  }
  82% {
    opacity: 0.4;
  }
  100% {
    background-position: 130% 60%, 60% 50%;
    opacity: 0;
    transform: translate3d(8%, 1%, 0) rotate(6deg) scale(1.1);
  }
}

@keyframes silk-pulse {
  0%, 100% {
    opacity: 0.05;
    transform: scale(1);
  }
  30% {
    opacity: 0.35;
    transform: scale(1.04);
  }
  55% {
    opacity: 0.1;
    transform: scale(1.01);
  }
  78% {
    opacity: 0.28;
    transform: scale(1.03);
  }
}

@media (max-width: 768px) {
  .silk-fold-a,
  .silk-fold-b {
    filter: blur(1.5px);
    animation-duration: 36s, 44s;
  }

  .silk-sheen {
    animation-duration: 24s;
  }

  .silk-fold-b {
    opacity: 0.22;
  }
}

@media (prefers-reduced-motion: reduce) {
  .silk-fold-a,
  .silk-fold-b,
  .silk-sheen,
  .silk-pulse {
    animation: none !important;
  }

  .silk-fold-a {
    opacity: 0.35;
    background-position: 40% 40%;
  }

  .silk-fold-b {
    opacity: 0.2;
    background-position: 60% 50%;
  }

  .silk-sheen {
    opacity: 0.12;
    background-position: 50% 50%, 50% 50%;
  }

  .silk-pulse {
    opacity: 0.12;
  }
}
</style>
