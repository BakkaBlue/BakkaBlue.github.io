// ==================== Asset Manager ====================

import { Registry } from './Registry'
import { MergePolicy, ProviderType, type ResourceProvider } from './loaders/types'

export type ThemeVariables = Record<string, string>

/**
 * Central asset manager that coordinates ResourceProviders, loads data into
 * the Registry, and provides typed accessors.
 *
 * Usage:
 * ```ts
 * const am = new AssetManager()
 * am.registerProvider(new BaseDataProvider(ProviderType.Items))
 * await am.preloadAll()
 * const items = am.getData<ItemConfig>('items')
 * ```
 */
export class AssetManager {
  private registry = new Registry()
  private providers: ResourceProvider[] = []
  private loaded = false

  /** Theme variable maps loaded from JSON. */
  private themes = new Map<string, ThemeVariables>()

  // ---------------------------------------------------------------------------
  // Registration
  // ---------------------------------------------------------------------------

  /** Register a new resource provider.  Does NOT load data yet. */
  registerProvider(provider: ResourceProvider): void {
    this.providers.push(provider)
  }

  /** Convenience: register multiple providers at once. */
  registerProviders(...providers: ResourceProvider[]): void {
    for (const p of providers) this.providers.push(p)
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  /**
   * Call every registered provider's `load()` and populate the registry.
   * Safe to call multiple times — subsequent calls reload.
   */
  async preloadAll(): Promise<void> {
    for (const provider of this.providers) {
      const data = await provider.load()
      if (provider.type === ProviderType.Themes) continue // handled separately

      for (const [id, value] of data) {
        const existing = this.registry.get(provider.type, id)

        if (existing !== undefined) {
          switch (provider.mergePolicy) {
            case MergePolicy.Ignore:
              continue // keep existing
            case MergePolicy.Merge:
              this.registry.register(provider.type, id, {
                ...existing,
                ...value,
              }, { source: `provider:${provider.type}` })
              continue
            case MergePolicy.Replace:
            default:
              break // fall through to register
          }
        }

        this.registry.register(provider.type, id, value, {
          source: `provider:${provider.type}`,
          version: 1,
        })
      }
    }

    this.loaded = true
  }

  /** Whether `preloadAll()` has been called at least once. */
  isLoaded(): boolean {
    return this.loaded
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  /** Get all data for a domain. */
  getData<T = any>(domain: string): T[]
  /** Get a single asset by domain + id. */
  getData<T = any>(domain: string, id: string): T | undefined
  getData<T = any>(domain: string, id?: string): T | T[] | undefined {
    if (id !== undefined) {
      return this.registry.get<T>(domain, id)
    }
    return this.registry.getAll<T>(domain)
  }

  // ---------------------------------------------------------------------------
  // Themes
  // ---------------------------------------------------------------------------

  /**
   * Register a theme's CSS variables from a loaded JSON object.
   * Called by ThemeService after fetching the JSON file.
   */
  registerTheme(name: string, variables: ThemeVariables): void {
    this.themes.set(name, variables)
    // Also register in the registry under the themes domain
    this.registry.register('themes', name, variables, {
      source: 'theme-json',
    })
  }

  /** Retrieve CSS variable map for a named theme. */
  getTheme(name: string): ThemeVariables | undefined {
    return this.themes.get(name)
  }

  /** List all registered theme names. */
  getThemeNames(): string[] {
    return Array.from(this.themes.keys())
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  /** Expose the underlying registry for advanced use. */
  getRegistry(): Registry {
    return this.registry
  }

  /** Remove all data and providers. */
  reset(): void {
    this.registry.clear()
    this.providers = []
    this.themes.clear()
    this.loaded = false
  }
}
