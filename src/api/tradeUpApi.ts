import type { ItemExterior, ItemRarity } from './casesApi'
import { apiRequest } from './client'

export type TradeUpResponse = {
  inventoryItemId: number
  itemId: number
  code: string
  displayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack: boolean
  floatValue: number
  paintSeed: number
  suggestedSellPrice: number
}

export function tradeUp(inventoryItemIds: number[]): Promise<TradeUpResponse> {
  return apiRequest<TradeUpResponse>('/api/economy/trade-up', {
    method: 'POST',
    body: { inventoryItemIds },
  })
}

export const tradeUpApi = { tradeUp }
