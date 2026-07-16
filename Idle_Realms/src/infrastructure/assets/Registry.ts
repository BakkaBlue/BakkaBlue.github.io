// ==================== Dual-Index Asset Registry ====================

import type { AssetMeta } from './loaders/types'

export interface RegistryEntry<T> {
  meta: AssetMeta
  data: T
}

/**
 * Dual-index storage that maintains per-domain maps (by id) and lists.
 *
 * - `byId` : Map<domain, Map<id, RegistryEntry<T>>>
 * - `lists`: Map<domain, RegistryEntry<T>[]>  (insertion-order)
 */
export class Registry {
  private byId = new Map<string, Map<string, RegistryEntry<any>>>()
  private lists = new Map<string, RegistryEntry<any>[]>()

  /**
   * Register a single asset.  If an entry for the same domain+id already
   * exists the `onConflict` callback decides how to resolve it (default:
   * replace).
   */
  register<T>(
    domain: string,
    id: string,
    data: T,
    meta?: Partial<AssetMeta>,
  ): void {
    let domainIndex = this.byId.get(domain)
    if (!domainIndex) {
      domainIndex = new Map()
      this.byId.set(domain, domainIndex)
      this.lists.set(domain, [])
    }

    const entry: RegistryEntry<T> = {
      meta: {
        id,
        domain,
        source: meta?.source,
        version: meta?.version,
        loadedAt: meta?.loadedAt ?? Date.now(),
      },
      data,
    }

    const existing = domainIndex.get(id)
    if (!existing) {
      // New entry — append to list
      domainIndex.set(id, entry)
      this.lists.get(domain)!.push(entry)
    } else {
      // Replace in-place so the list reference stays valid
      domainIndex.set(id, entry)
      const list = this.lists.get(domain)!
      const idx = list.findIndex(e => e.meta.id === id)
      if (idx !== -1) list[idx] = entry
      else list.push(entry)
    }
  }

  /**
   * Register multiple assets for the same domain at once.
   */
  registerMany<T>(
    domain: string,
    entries: { id: string; data: T; meta?: Partial<AssetMeta> }[],
  ): void {
    for (const e of entries) {
      this.register(domain, e.id, e.data, e.meta)
    }
  }

  /** Get a single asset by domain + id.  Returns undefined when not found. */
  get<T = any>(domain: string, id: string): T | undefined {
    return this.byId.get(domain)?.get(id)?.data as T | undefined
  }

  /** Get the full RegistryEntry wrapper. */
  getEntry<T = any>(domain: string, id: string): RegistryEntry<T> | undefined {
    return this.byId.get(domain)?.get(id) as RegistryEntry<T> | undefined
  }

  /** Return all data values for a domain as an array. */
  getAll<T = any>(domain: string): T[] {
    const list = this.lists.get(domain)
    return list ? list.map(e => e.data as T) : []
  }

  /** Check whether a domain+id exists. */
  has(domain: string, id: string): boolean {
    return this.byId.get(domain)?.has(id) ?? false
  }

  /** Remove one asset, or an entire domain when id is omitted. */
  remove(domain: string, id?: string): boolean {
    if (id === undefined) {
      return this.byId.delete(domain) || this.lists.delete(domain)
    }
    const deleted = this.byId.get(domain)?.delete(id) ?? false
    if (deleted) {
      const list = this.lists.get(domain)
      if (list) {
        const idx = list.findIndex(e => e.meta.id === id)
        if (idx !== -1) list.splice(idx, 1)
      }
    }
    return deleted
  }

  /** Remove all data. */
  clear(): void {
    this.byId.clear()
    this.lists.clear()
  }

  /** List all registered domain names. */
  domains(): string[] {
    return Array.from(this.byId.keys())
  }

  /** Number of entries in a domain (0 if the domain doesn't exist). */
  size(domain: string): number {
    return this.byId.get(domain)?.size ?? 0
  }

  /** Total number of entries across all domains. */
  get totalSize(): number {
    let count = 0
    for (const idx of this.byId.values()) count += idx.size
    return count
  }
}
