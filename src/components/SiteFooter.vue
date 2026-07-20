<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p>© 2026 Cyan</p>
      <p class="sub">Personal site · Apple-inspired</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 28px 0 12px;
  margin-top: 20px;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--border);
  padding-top: 16px;
  color: var(--text-muted);
  font-size: 0.84rem;
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
  }
}
</style>
