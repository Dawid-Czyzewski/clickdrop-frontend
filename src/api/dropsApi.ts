import { apiRequest } from './client'
import type { ItemExterior, ItemRarity } from './casesApi'

export type RecentDropSource = 'CASE' | 'DAILY'

export type RecentDrop = {
  itemCode: string
  displayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack: boolean
  source: RecentDropSource
  createdAt: string
}

export function getRecentDrops(limit = 20): Promise<RecentDrop[]> {
  const query = limit > 0 ? `?limit=${limit}` : ''
  return apiRequest<RecentDrop[]>(`/api/economy/drops/recent${query}`, { auth: false })
}

export const dropsApi = {
  getRecentDrops,
}
