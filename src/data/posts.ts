export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  /** compiled HTML from markdown */
  html: string
}

interface MdModule {
  attributes: {
    title?: string
    excerpt?: string
    date?: string
    tags?: string[] | string
  }
  html: string
}

/**
 * Load every Markdown file under content/blog/
 * Write new posts as content/blog/your-slug.md with YAML frontmatter.
 */
const modules = import.meta.glob<MdModule>('../../content/blog/*.md', {
  eager: true,
})

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map(String)
  if (typeof tags === 'string' && tags.trim()) {
    return tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
  }
  return []
}

function slugFromPath(path: string): string {
  const file = path.split(/[/\\]/).pop() || path
  return file.replace(/\.md$/i, '')
}

function loadPosts(): BlogPost[] {
  const list: BlogPost[] = []

  for (const [path, mod] of Object.entries(modules)) {
    const attrs = mod?.attributes ?? {}
    const slug = slugFromPath(path)
    const title = String(attrs.title ?? slug)
    const date = String(attrs.date ?? '1970-01-01')
    const excerpt = String(attrs.excerpt ?? '')
    const tags = normalizeTags(attrs.tags)
    const html = String(mod?.html ?? '')

    list.push({ slug, title, excerpt, date, tags, html })
  }

  return list.sort((a, b) => (a.date < b.date ? 1 : -1))
}

const posts = loadPosts()

export function getAllPosts(): BlogPost[] {
  return posts
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${y}.${m}.${d}`
}
