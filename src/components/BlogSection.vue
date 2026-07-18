<template>
  <section id="blog" class="section">
    <div class="section-inner">
      <header class="section-header blog-header">
        <div>
          <p class="section-kicker">Notes</p>
          <h2 class="section-title">博客</h2>
          <p class="section-desc">碎片想法与过程记录。不求系统，只求诚实。</p>
        </div>
        <a class="blog-all" href="/blog" @click.prevent="goBlog">全部文章 →</a>
      </header>

      <div class="blog-list">
        <a
          v-for="(post, i) in latest"
          :key="post.slug"
          :href="`/blog/${post.slug}`"
          class="blog-row glass-card reveal"
          :class="'reveal-delay-' + (i + 1)"
          @click.prevent="goPost(post.slug)"
        >
          <div class="blog-main">
            <time class="blog-date">{{ formatDate(post.date) }}</time>
            <h3 class="blog-title">{{ post.title }}</h3>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
          </div>
          <div class="blog-meta">
            <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="blog-tag">{{ tag }}</span>
            <span class="blog-go">阅读</span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, getAllPosts } from '@/data/posts'
import { useAppRoute } from '@/composables/useAppRoute'

const { goBlog, goPost } = useAppRoute()
const latest = computed(() => getAllPosts().slice(0, 3))
</script>

<style scoped>
.blog-header {
  width: 100%;
  max-width: none;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.blog-all {
  color: var(--text-secondary);
  font-size: 0.92rem;
  white-space: nowrap;
  border-bottom: 1px solid transparent;
  transition: color 0.25s ease, border-color 0.25s ease;
}

.blog-all:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-primary) 30%, transparent);
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 24px;
  text-decoration: none;
  color: inherit;
}

.blog-main {
  min-width: 0;
}

.blog-date {
  display: block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
}

.blog-title {
  font-size: 1.12rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.blog-excerpt {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.65;
  max-width: 62ch;
}

.blog-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.blog-tag {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  padding: 4px 9px;
}

.blog-go {
  color: var(--accent);
  font-size: 0.9rem;
}

.blog-row:hover .blog-go {
  color: var(--text-primary);
}

@media (max-width: 760px) {
  .blog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .blog-row {
    flex-direction: column;
    gap: 14px;
  }

  .blog-meta {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
