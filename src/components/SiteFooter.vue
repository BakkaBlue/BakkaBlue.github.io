<template>
  <footer class="site-footer">
    <div class="section-inner footer-inner">
      <p class="footer-text">© 2024 Cyren</p>
      <p class="footer-sub">Vue · Glassmorphism · Quiet details</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// presentation only
</script>

<style scoped>
.site-footer {
  position: relative;
  z-index: 1;
  padding: 28px 28px 56px;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--glass-border);
  padding-top: 24px;
}

.footer-text,
.footer-sub {
  color: var(--text-muted);
  font-size: 0.86rem;
}

.footer-sub {
  letter-spacing: 0.06em;
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
