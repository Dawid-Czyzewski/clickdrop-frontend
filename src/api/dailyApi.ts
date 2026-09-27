import { apiRequest } from './client'
import type { ItemExterior, ItemRarity } from './casesApi'

export type DailyStatusResponse = {
  available: boolean
  nextClaimAt: string | null
}

export type DailySkinDrop = {
  type: 'SKIN'
  itemId: number
  itemCode: string
  itemDisplayName: string
  rarity: ItemRarity
  weight: number
}

export type DailyCashDrop = {
  type: 'CASH'
  cashAmount: number
  weight: number
}

export type DailyDrop = DailySkinDrop | DailyCashDrop

export type DailySkinClaim = {
  type: 'SKIN'
  inventoryItemId: number
  itemCode: string
  itemDisplayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  suggestedSellPrice: number
  nextClaimAt: string
}

export type DailyCashClaim = {
  type: 'CASH'
  cashAmount: number
  balance: number
  nextClaimAt: string
}

export type DailyClaimResponse = DailySkinClaim | DailyCashClaim

export function getDailyStatus(): Promise<DailyStatusResponse> {
  return apiRequest<DailyStatusResponse>('/api/economy/daily/status')
}

export function getDailyDrops(): Promise<DailyDrop[]> {
  return apiRequest<DailyDrop[]>('/api/economy/daily/drops', { auth: false })
}

export function claimDaily(): Promise<DailyClaimResponse> {
  return apiRequest<DailyClaimResponse>('/api/economy/daily/claim', {
    method: 'POST',
  })
}

export function isDailySkinClaim(claim: DailyClaimResponse): claim is DailySkinClaim {
  return claim.type === 'SKIN'
}

export function isDailyCashClaim(claim: DailyClaimResponse): claim is DailyCashClaim {
  return claim.type === 'CASH'
}

export const dailyApi = {
  getDailyStatus,
  getDailyDrops,
  claimDaily,
}
