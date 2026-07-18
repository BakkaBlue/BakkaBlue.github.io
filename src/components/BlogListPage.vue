<template>
  <section class="blog-page">
    <div class="blog-shell">
      <header class="page-header">
        <p class="kicker">Blog</p>
        <h1>全部文章</h1>
        <p class="sub">按时间倒序。短文居多，想到就写。</p>
      </header>

      <div class="list">
        <a
          v-for="post in all"
          :key="post.slug"
          :href="`/blog/${post.slug}`"
          class="item glass-card"
          @click.prevent="goPost(post.slug)"
        >
          <div class="item-top">
            <time>{{ formatDate(post.date) }}</time>
            <div class="tags">
              <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <h2>{{ post.title }}</h2>
          <p>{{ post.excerpt }}</p>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, getAllPosts } from '@/data/posts'
import { useAppRoute } from '@/composables/useAppRoute'

const { goPost } = useAppRoute()
const all = computed(() => getAllPosts())
</script>

<style scoped>
.blog-page {
  position: relative;
  z-index: 1;
  padding: 120px 24px 80px;
}

.blog-shell {
  width: min(100%, 800px);
  margin: 0 auto;
}

.page-header {
  margin-bottom: 36px;
}

.kicker {
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

h1 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  letter-spacing: -0.04em;
  margin-bottom: 10px;
}

.sub {
  color: var(--text-secondary);
  max-width: 40ch;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  display: block;
  padding: 22px 22px 20px;
  text-decoration: none;
  color: inherit;
}

.item-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}

time {
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tags span {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  padding: 3px 8px;
}

h2 {
  font-size: 1.2rem;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

p {
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.7;
}
</style>
