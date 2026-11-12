import type { InventoryItem } from '../api/casesApi'

export const TRADE_UP_COUNT = 10

const NEXT_RARITY: Record<string, string | null> = {
  MIL_SPEC: 'RESTRICTED',
  RESTRICTED: 'CLASSIFIED',
  CLASSIFIED: 'COVERT',
  COVERT: null,
}

export function canTradeUp(items: InventoryItem[]): boolean {
  if (items.length !== TRADE_UP_COUNT) return false
  const rarity = items[0]?.rarity
  if (!rarity || NEXT_RARITY[rarity] == null) return false
  return items.every((item) => item.rarity === rarity)
}
