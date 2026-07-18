import { computed, onMounted, onUnmounted, ref } from 'vue'

export type AppRoute = 'home' | 'settings'

function pathToRoute(pathname: string): AppRoute {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/settings') return 'settings'
  return 'home'
}

const route = ref<AppRoute>(pathToRoute(window.location.pathname))

function syncFromLocation() {
  route.value = pathToRoute(window.location.pathname)
}

export function useAppRoute() {
  const isSettings = computed(() => route.value === 'settings')
  const isHome = computed(() => route.value === 'home')

  function go(path: string) {
    const url = path.startsWith('/') ? path : `/${path}`
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url)
    }
    syncFromLocation()
    window.scrollTo(0, 0)
  }

  function backHome() {
    go('/')
  }

  onMounted(() => {
    window.addEventListener('popstate', syncFromLocation)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', syncFromLocation)
  })

  return {
    route,
    isSettings,
    isHome,
    go,
    backHome,
  }
}
