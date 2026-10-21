import type { InventoryItem, ItemExterior, ItemRarity } from '../api/casesApi'
import { resolveItemLabel } from './caseI18n'

export type StatTrackFilter = 'all' | 'yes' | 'no'
export type InventorySort = 'price_desc' | 'price_asc' | 'rarity' | 'name'

export type InventoryFilterState = {
  rarity: ItemRarity | 'all'
  exterior: ItemExterior | 'all'
  statTrack: StatTrackFilter
  sort: InventorySort
}

export const INVENTORY_RARITIES: ItemRarity[] = [
  'MIL_SPEC',
  'RESTRICTED',
  'CLASSIFIED',
  'COVERT',
]

export const INVENTORY_EXTERIORS: ItemExterior[] = [
  'FACTORY_NEW',
  'MINIMAL_WEAR',
  'FIELD_TESTED',
  'WELL_WORN',
  'BATTLE_SCARRED',
]

export const DEFAULT_INVENTORY_FILTERS: InventoryFilterState = {
  rarity: 'all',
  exterior: 'all',
  statTrack: 'all',
  sort: 'price_desc',
}

const STORAGE_KEY = 'clickdrop_inventory_filters'

const RARITY_RANK: Record<ItemRarity, number> = {
  MIL_SPEC: 1,
  RESTRICTED: 2,
  CLASSIFIED: 3,
  COVERT: 4,
}

function isRarity(value: string): value is ItemRarity {
  return INVENTORY_RARITIES.includes(value as ItemRarity)
}

function isExterior(value: string): value is ItemExterior {
  return INVENTORY_EXTERIORS.includes(value as ItemExterior)
}

function isStatTrackFilter(value: string): value is StatTrackFilter {
  return value === 'all' || value === 'yes' || value === 'no'
}

function isSort(value: string): value is InventorySort {
  return (
    value === 'price_desc' ||
    value === 'price_asc' ||
    value === 'rarity' ||
    value === 'name'
  )
}

export function loadInventoryFilters(): InventoryFilterState {
  if (typeof window === 'undefined') return { ...DEFAULT_INVENTORY_FILTERS }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_INVENTORY_FILTERS }
    const parsed = JSON.parse(raw) as Partial<InventoryFilterState>
    return {
      rarity:
        parsed.rarity === 'all' || (parsed.rarity && isRarity(parsed.rarity))
          ? parsed.rarity
          : 'all',
      exterior:
        parsed.exterior === 'all' ||
        (parsed.exterior && isExterior(parsed.exterior))
          ? parsed.exterior
          : 'all',
      statTrack:
        parsed.statTrack && isStatTrackFilter(parsed.statTrack)
          ? parsed.statTrack
          : 'all',
      sort: parsed.sort && isSort(parsed.sort) ? parsed.sort : 'price_desc',
    }
  } catch {
    return { ...DEFAULT_INVENTORY_FILTERS }
  }
}

export function saveInventoryFilters(filters: InventoryFilterState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
}

export function hasActiveInventoryFilters(filters: InventoryFilterState): boolean {
  return (
    filters.rarity !== 'all' ||
    filters.exterior !== 'all' ||
    filters.statTrack !== 'all' ||
    filters.sort !== DEFAULT_INVENTORY_FILTERS.sort
  )
}

export function filterInventoryItems(
  items: InventoryItem[],
  filters: InventoryFilterState,
): InventoryItem[] {
  return items.filter((item) => {
    if (filters.rarity !== 'all' && item.rarity !== filters.rarity) return false
    if (filters.exterior !== 'all' && item.exterior !== filters.exterior) {
      return false
    }
    if (filters.statTrack === 'yes' && !item.statTrack) return false
    if (filters.statTrack === 'no' && item.statTrack) return false
    return true
  })
}

export function sortInventoryItems(
  items: InventoryItem[],
  sort: InventorySort,
  t: (key: string) => string = (key) => key,
): InventoryItem[] {
  const next = [...items]
  next.sort((a, b) => {
    if (sort === 'price_desc') return b.suggestedSellPrice - a.suggestedSellPrice
    if (sort === 'price_asc') return a.suggestedSellPrice - b.suggestedSellPrice
    if (sort === 'rarity') {
      const byRarity = RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity]
      if (byRarity !== 0) return byRarity
      return b.suggestedSellPrice - a.suggestedSellPrice
    }
    const nameA = resolveItemLabel(t, a.code, a.displayName)
    const nameB = resolveItemLabel(t, b.code, b.displayName)
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' })
  })
  return next
}

export function applyInventoryFilters(
  items: InventoryItem[],
  filters: InventoryFilterState,
  t?: (key: string) => string,
): InventoryItem[] {
  return sortInventoryItems(filterInventoryItems(items, filters), filters.sort, t)
}
