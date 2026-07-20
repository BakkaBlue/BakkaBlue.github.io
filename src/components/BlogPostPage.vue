<template>
  <article class="section page-shell post-page">
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

      <div class="post-body card md-body" v-html="post.html"></div>

      <footer class="post-footer">
        <a href="/blog" class="btn" @click.prevent="goBlog">返回列表</a>
        <a href="/" class="text-link" @click.prevent="goHome">回到主页</a>
      </footer>
    </div>

    <div class="post-shell missing" v-else>
      <h1>文章不存在</h1>
      <p>可能链接失效，或 content/blog 里还没有对应的 .md。</p>
      <a href="/blog" class="btn" @click.prevent="goBlog">去博客列表</a>
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
.post-shell {
  width: min(100%, 720px);
}

.back {
  display: inline-block;
  color: var(--accent);
  font-size: 0.92rem;
  margin-bottom: 18px;
}

.kicker {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 10px;
  font-variant-numeric: tabular-nums;
}

h1 {
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  letter-spacing: -0.035em;
  line-height: 1.15;
  margin-bottom: 12px;
}

.excerpt {
  color: var(--text-secondary);
  font-size: 1.08rem;
  line-height: 1.55;
  margin-bottom: 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}

.tags span {
  font-size: 0.74rem;
  color: var(--text-muted);
  background: var(--bg-soft);
  border-radius: 999px;
  padding: 4px 9px;
}

.post-body {
  padding: 26px;
  margin-bottom: 22px;
}

.md-body :deep(p) {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.75;
  margin-bottom: 1em;
}

.md-body :deep(h1),
.md-body :deep(h2),
.md-body :deep(h3) {
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin: 1.4em 0 0.65em;
  line-height: 1.25;
}

.md-body :deep(h1) { font-size: 1.35rem; }
.md-body :deep(h2) { font-size: 1.2rem; }
.md-body :deep(h3) { font-size: 1.08rem; }

.md-body :deep(ul),
.md-body :deep(ol) {
  margin: 0 0 1.1em 1.15em;
  color: var(--text-secondary);
  line-height: 1.7;
}

.md-body :deep(li) {
  margin-bottom: 0.3em;
}

.md-body :deep(a) {
  color: var(--accent);
}

.md-body :deep(blockquote) {
  margin: 0 0 1.1em;
  padding: 0.15em 0 0.15em 1em;
  border-left: 3px solid var(--border-strong);
  color: var(--text-muted);
}

.md-body :deep(pre) {
  margin: 0 0 1.1em;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  overflow: auto;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.md-body :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.92em;
}

.md-body :deep(:not(pre) > code) {
  padding: 0.1em 0.35em;
  border-radius: 6px;
  background: var(--bg-soft);
}

.md-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.6em 0;
}

.md-body :deep(img) {
  max-width: 100%;
  border-radius: 14px;
  margin: 0.5em 0 1em;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.text-link {
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.text-link:hover {
  color: var(--accent);
}

.missing h1 {
  margin-bottom: 10px;
}

.missing p {
  color: var(--text-secondary);
  margin-bottom: 18px;
}
</style>
