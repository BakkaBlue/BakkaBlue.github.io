import { computed, onMounted, onUnmounted, ref } from 'vue'

export type AppRoute =
  | { name: 'home' }
  | { name: 'blog' }
  | { name: 'blog-post'; slug: string }

function parsePath(pathname: string): AppRoute {
  const path = (pathname.replace(/\/+$/, '') || '/')
  if (path === '/blog') return { name: 'blog' }
  const m = path.match(/^\/blog\/([^/]+)$/)
  if (m) return { name: 'blog-post', slug: decodeURIComponent(m[1]) }
  return { name: 'home' }
}

const route = ref<AppRoute>(parsePath(window.location.pathname))

function sync() {
  route.value = parsePath(window.location.pathname)
}

export function useAppRoute() {
  const isHome = computed(() => route.value.name === 'home')
  const isBlog = computed(() => route.value.name === 'blog')
  const isBlogPost = computed(() => route.value.name === 'blog-post')
  const blogSlug = computed(() =>
    route.value.name === 'blog-post' ? route.value.slug : '',
  )

  function go(path: string) {
    const url = path.startsWith('/') ? path : `/${path}`
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url)
    }
    sync()
    window.scrollTo(0, 0)
  }

  function goHome() {
    go('/')
  }

  function goBlog() {
    go('/blog')
  }

  function goPost(slug: string) {
    go(`/blog/${encodeURIComponent(slug)}`)
  }

  onMounted(() => {
    window.addEventListener('popstate', sync)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', sync)
  })

  return {
    route,
    isHome,
    isBlog,
    isBlogPost,
    blogSlug,
    go,
    goHome,
    goBlog,
    goPost,
  }
}
