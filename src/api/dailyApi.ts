import { apiRequest } from './client'
import type { ItemExterior, ItemRarity } from './casesApi'

export type DailyStatusResponse = {
  available: boolean
  nextClaimAt: string | null
}

export type DailyClaimResponse = {
  inventoryItemId: number
  itemCode: string
  rarity: ItemRarity
  exterior: ItemExterior
  suggestedSellPrice: number
  nextClaimAt: string
}

export function getDailyStatus(): Promise<DailyStatusResponse> {
  return apiRequest<DailyStatusResponse>('/api/economy/daily/status')
}

export function claimDaily(): Promise<DailyClaimResponse> {
  return apiRequest<DailyClaimResponse>('/api/economy/daily/claim', {
    method: 'POST',
  })
}

export const dailyApi = {
  getDailyStatus,
  claimDaily,
}
