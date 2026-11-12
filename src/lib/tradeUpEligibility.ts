import type { InventoryItem, ItemExterior, ItemRarity } from '../api/casesApi'

export const TRADE_UP_COUNT = 10

export const TRADE_UP_EXTERIORS: ItemExterior[] = [
  'FACTORY_NEW',
  'MINIMAL_WEAR',
  'FIELD_TESTED',
  'WELL_WORN',
  'BATTLE_SCARRED',
]

const NEXT_RARITY: Record<ItemRarity, ItemRarity | null> = {
  MIL_SPEC: 'RESTRICTED',
  RESTRICTED: 'CLASSIFIED',
  CLASSIFIED: 'COVERT',
  COVERT: null,
}

export type TradeUpValidation =
  | { ok: true; rarity: ItemRarity; targetRarity: ItemRarity }
  | { ok: false; reason: 'count' | 'unique' | 'rarity' | 'covert' | 'empty' }

export function nextRarity(rarity: ItemRarity): ItemRarity | null {
  return NEXT_RARITY[rarity]
}

export function averageExterior(exteriors: ItemExterior[]): ItemExterior {
  const sum = exteriors.reduce((acc, ext) => acc + TRADE_UP_EXTERIORS.indexOf(ext), 0)
  const avg = sum / exteriors.length
  const index = Math.min(
    TRADE_UP_EXTERIORS.length - 1,
    Math.max(0, Math.round(avg)),
  )
  return TRADE_UP_EXTERIORS[index] ?? 'FIELD_TESTED'
}

export function resultStatTrack(items: InventoryItem[]): boolean {
  return items.length === TRADE_UP_COUNT && items.every((item) => Boolean(item.statTrack))
}

export function validateTradeUp(items: InventoryItem[]): TradeUpValidation {
  if (items.length === 0) return { ok: false, reason: 'empty' }
  if (items.length !== TRADE_UP_COUNT) return { ok: false, reason: 'count' }

  const ids = items.map((item) => item.inventoryItemId)
  if (new Set(ids).size !== TRADE_UP_COUNT) return { ok: false, reason: 'unique' }

  const rarity = items[0]?.rarity
  if (!rarity || items.some((item) => item.rarity !== rarity)) {
    return { ok: false, reason: 'rarity' }
  }

  const target = nextRarity(rarity)
  if (!target) return { ok: false, reason: 'covert' }

  return { ok: true, rarity, targetRarity: target }
}

export function canTradeUp(items: InventoryItem[]): boolean {
  return validateTradeUp(items).ok
}
