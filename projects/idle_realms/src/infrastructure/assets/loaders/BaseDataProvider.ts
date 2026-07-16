// ==================== Base Data Provider (wraps src/data/ imports) ====================

import { ProviderType, MergePolicy, type ResourceProvider } from './types'

/**
 * Wraps static data modules from `src/data/` into ResourceProviders.
 *
 * Each provider lazily imports its module on first `load()` call so unused
 * domains are never parsed.
 */
export class BaseDataProvider implements ResourceProvider {
  readonly type: ProviderType
  readonly mergePolicy = MergePolicy.Replace

  private loaded = false
  private cache = new Map<string, any>()

  constructor(type: ProviderType) {
    this.type = type
  }

  async load(): Promise<Map<string, any>> {
    if (this.loaded) return this.cache
    this.loaded = true

    switch (this.type) {
      case ProviderType.Items: {
        const { ITEMS } = await import('@/data/items')
        this.cache = new Map(Object.entries(ITEMS))
        break
      }
      case ProviderType.Monsters: {
        const { ENEMIES } = await import('@/data/monsters')
        this.cache = new Map(ENEMIES.map((e: any) => [e.id, e]))
        break
      }
      case ProviderType.Skills: {
        const { SKILLS } = await import('@/data/skills')
        this.cache = new Map(SKILLS.map((s: any) => [s.id, s]))
        break
      }
      case ProviderType.Buildings: {
        const { BUILDINGS } = await import('@/data/buildings')
        this.cache = new Map(Object.entries(BUILDINGS))
        break
      }
      case ProviderType.Farming: {
        const mod = await import('@/data/farming')
        this.cache = new Map<string, any>()
        // Farming data has two main exports: PLOT_TYPES + FARM_CROPS
        this.cache.set('_plot_types', mod.PLOT_TYPES)
        this.cache.set('_crops_record', mod.FARM_CROPS)
        // Also register each crop individually
        for (const [id, crop] of Object.entries<any>(mod.FARM_CROPS)) {
          this.cache.set(`crop:${id}`, crop)
        }
        break
      }
      case ProviderType.Shop: {
        const { SHOP_ITEMS } = await import('@/data/shop')
        this.cache = new Map(SHOP_ITEMS.map((s: any) => [s.id, s]))
        break
      }
      case ProviderType.TownShop: {
        const { TOWN_SHOP_ITEMS } = await import('@/data/town-shop')
        this.cache = new Map(TOWN_SHOP_ITEMS.map((t: any) => [t.id, t]))
        break
      }
      case ProviderType.Facilities: {
        const { FACILITIES } = await import('@/data/facilities')
        this.cache = new Map(Object.entries(FACILITIES))
        break
      }
      case ProviderType.Slayer: {
        const { SLAYER_MASTERS } = await import('@/data/slayer')
        this.cache = new Map(SLAYER_MASTERS.map((m: any) => [m.id, m]))
        break
      }
      case ProviderType.Themes: {
        // Themes are loaded from JSON files via AssetManager.getTheme()
        // This provider is a no-op — themes are handled separately.
        this.cache = new Map()
        break
      }
      case ProviderType.Settings: {
        const { DEFAULT_SETTINGS } = await import('@/data/settings')
        this.cache = new Map(Object.entries(DEFAULT_SETTINGS))
        break
      }
      default:
        this.cache = new Map()
        break
    }

    return this.cache
  }
}
