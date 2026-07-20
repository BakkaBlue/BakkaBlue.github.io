import { computed, onMounted, onUnmounted, ref } from 'vue'

export type RouteName =
  | 'home'
  | 'skills'
  | 'github'
  | 'projects'
  | 'blog'
  | 'blog-post'
  | 'contact'

export type AppRoute =
  | { name: 'home' }
  | { name: 'skills' }
  | { name: 'github' }
  | { name: 'projects' }
  | { name: 'blog' }
  | { name: 'blog-post'; slug: string }
  | { name: 'contact' }

const TITLES: Record<RouteName, string> = {
  home: '总览',
  skills: '技能',
  github: 'GitHub',
  projects: '项目',
  blog: '博客',
  'blog-post': '文章',
  contact: '联系',
}

function parsePath(pathname: string): AppRoute {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return { name: 'home' }
  if (path === '/skills') return { name: 'skills' }
  if (path === '/github') return { name: 'github' }
  if (path === '/projects') return { name: 'projects' }
  if (path === '/contact') return { name: 'contact' }
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
  const name = computed<RouteName>(() => route.value.name)
  const isHome = computed(() => route.value.name === 'home')
  const isSkills = computed(() => route.value.name === 'skills')
  const isGithub = computed(() => route.value.name === 'github')
  const isProjects = computed(() => route.value.name === 'projects')
  const isBlog = computed(() => route.value.name === 'blog')
  const isBlogPost = computed(() => route.value.name === 'blog-post')
  const isContact = computed(() => route.value.name === 'contact')
  const blogSlug = computed(() =>
    route.value.name === 'blog-post' ? route.value.slug : '',
  )
  const pageTitle = computed(() => TITLES[route.value.name] ?? 'Cyan')

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
  function goSkills() {
    go('/skills')
  }
  function goGithub() {
    go('/github')
  }
  function goProjects() {
    go('/projects')
  }
  function goBlog() {
    go('/blog')
  }
  function goPost(slug: string) {
    go(`/blog/${encodeURIComponent(slug)}`)
  }
  function goContact() {
    go('/contact')
  }

  onMounted(() => {
    window.addEventListener('popstate', sync)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', sync)
  })

  return {
    route,
    name,
    isHome,
    isSkills,
    isGithub,
    isProjects,
    isBlog,
    isBlogPost,
    isContact,
    blogSlug,
    pageTitle,
    go,
    goHome,
    goSkills,
    goGithub,
    goProjects,
    goBlog,
    goPost,
    goContact,
  }
}
