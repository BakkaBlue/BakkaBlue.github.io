import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import MarkdownIt from 'markdown-it'
import fm from 'front-matter'

/**
 * Compile content/blog/*.md → { attributes, html }
 * Usage: import.meta.glob('../../content/blog/*.md', { eager: true })
 */
function markdownBlogPlugin(): Plugin {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true,
  })

  return {
    name: 'markdown-blog',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null
      // only transform project markdown, not deps
      if (!id.includes('content') && !id.includes('blog')) {
        // still allow any .md in repo root content paths
      }

      const { attributes, body } = fm<Record<string, unknown>>(code)
      const html = md.render(body)
      const payload = {
        attributes: attributes ?? {},
        html,
      }
      return {
        code: `export const attributes = ${JSON.stringify(payload.attributes)};\nexport const html = ${JSON.stringify(payload.html)};\nexport default { attributes, html };\n`,
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), markdownBlogPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    reportCompressedSize: false,
  },
})
