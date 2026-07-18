<template>
  <article class="post-page">
    <div class="post-shell" v-if="post">
      <header class="post-header">
        <a class="back" href="/blog" @click.prevent="goBlog">← 博客</a>
        <p class="kicker">{{ formatDate(post.date) }}</p>
        <h1>{{ post.title }}</h1>
        <p class="excerpt">{{ post.excerpt }}</p>
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
        </div>
      </header>

      <div class="post-body glass-card">
        <template v-for="(block, i) in post.body" :key="i">
          <p v-if="block.type === 'p'">{{ block.text }}</p>
          <h2 v-else-if="block.type === 'h2'">{{ block.text }}</h2>
          <ul v-else-if="block.type === 'ul'">
            <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
          </ul>
          <pre v-else-if="block.type === 'code'"><code>{{ block.text }}</code></pre>
        </template>
      </div>

      <footer class="post-footer">
        <a href="/blog" class="glass-btn" @click.prevent="goBlog">返回列表</a>
        <a href="/" class="text-link" @click.prevent="goHome">回到主页</a>
      </footer>
    </div>

    <div class="post-shell missing" v-else>
      <h1>文章不存在</h1>
      <p>可能链接失效，或还没写出来。</p>
      <a href="/blog" class="glass-btn" @click.prevent="goBlog">去博客列表</a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { formatDate, getPost } from '@/data/posts'
import { useAppRoute } from '@/composables/useAppRoute'

const props = defineProps<{ slug: string }>()
const { goBlog, goHome } = useAppRoute()

const post = computed(() => getPost(props.slug))

watch(
  post,
  (p) => {
    document.title = p ? `${p.title} · Cyan` : '未找到 · Cyan'
  },
  { immediate: true },
)
</script>

<style scoped>
.post-page {
  position: relative;
  z-index: 1;
  padding: 120px 24px 80px;
}

.post-shell {
  width: min(100%, 720px);
  margin: 0 auto;
}

.back {
  display: inline-block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 22px;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.back:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-primary) 30%, transparent);
}

.kicker {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-variant-numeric: tabular-nums;
}

h1 {
  font-size: clamp(1.9rem, 4vw, 2.5rem);
  letter-spacing: -0.035em;
  line-height: 1.2;
  margin-bottom: 14px;
}

.excerpt {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.tags span {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  padding: 4px 9px;
}

.post-body {
  padding: 28px 26px;
  margin-bottom: 28px;
}

.post-body :deep(p),
.post-body p {
  color: var(--text-secondary);
  font-size: 1.02rem;
  line-height: 1.9;
  margin-bottom: 1.1em;
}

.post-body h2 {
  font-size: 1.2rem;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 1.6em 0 0.7em;
}

.post-body ul {
  margin: 0 0 1.2em 1.1em;
  color: var(--text-secondary);
  line-height: 1.8;
}

.post-body li {
  margin-bottom: 0.35em;
}

.post-body pre {
  margin: 0 0 1.2em;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  overflow: auto;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.text-link {
  color: var(--text-secondary);
  font-size: 0.92rem;
  border-bottom: 1px solid transparent;
}

.text-link:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-primary) 30%, transparent);
}

.missing h1 {
  margin-bottom: 10px;
}

.missing p {
  color: var(--text-secondary);
  margin-bottom: 20px;
}
</style>
