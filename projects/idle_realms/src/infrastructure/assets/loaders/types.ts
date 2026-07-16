// ==================== Asset/Provider Type Definitions ====================

/** Domains of data that providers can supply. */
export enum ProviderType {
  Items = 'items',
  Monsters = 'monsters',
  Skills = 'skills',
  Buildings = 'buildings',
  Farming = 'farming',
  Shop = 'shop',
  TownShop = 'town_shop',
  Facilities = 'facilities',
  Slayer = 'slayer',
  Themes = 'themes',
  Settings = 'settings',
}

/** How the AssetManager merges data when multiple providers target the same domain. */
export enum MergePolicy {
  /** Last-registered provider wins for a given id. */
  Replace = 'replace',
  /** Shallow-merge the incoming data with existing entries. */
  Merge = 'merge',
  /** Skip entries whose id already exists. */
  Ignore = 'ignore',
}

/** Metadata attached to every asset in the Registry. */
export interface AssetMeta {
  id: string
  domain: string
  version?: number
  source?: string
  loadedAt?: number
}

/**
 * A provider delivers domain-scoped data to the AssetManager.
 * Each provider knows its domain, merge strategy, and how to load its data.
 */
export interface ResourceProvider<T = any> {
  readonly type: ProviderType
  readonly mergePolicy: MergePolicy
  load(): Promise<Map<string, T>> | Map<string, T>
}
