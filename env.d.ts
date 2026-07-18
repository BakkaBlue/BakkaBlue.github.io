/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.md' {
  export const attributes: {
    title?: string
    excerpt?: string
    date?: string
    tags?: string[] | string
    [key: string]: unknown
  }
  export const html: string
  const mod: { attributes: typeof attributes; html: string }
  export default mod
}
