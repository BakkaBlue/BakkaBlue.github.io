<template>
  <section class="section page-shell">
    <div class="blog-shell">
      <header class="section-header">
        <p class="section-kicker">Blog</p>
        <h2 class="section-title">全部文章</h2>
        <p class="section-desc">按时间倒序。短文居多，想到就写。</p>
      </header>

      <div class="list">
        <a
          v-for="post in all"
          :key="post.slug"
          :href="`/blog/${post.slug}`"
          class="item card"
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
.blog-shell {
  width: min(100%, 800px);
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

.item:hover {
  transform: translateY(-2px);
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
  color: var(--text-muted);
  background: var(--bg-soft);
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
