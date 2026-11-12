import { apiRequest } from './client'
import type { ItemRarity } from './casesApi'

export type CollectionProgress = {
  code: string
  displayName: string
  sortOrder: number
  owned: number
  total: number
  completed: boolean
  rewardCd: number
  rewardClaimed: boolean
}

export type CollectionItemProgress = {
  itemId: number
  code: string
  displayName: string
  rarity: ItemRarity
  owned: boolean
}

export type CollectionDetail = CollectionProgress & {
  items: CollectionItemProgress[]
}

export type CollectionClaimResponse = {
  code: string
  rewardCd: number
  balance: number
}

export function getCollections(): Promise<CollectionProgress[]> {
  return apiRequest<CollectionProgress[]>('/api/economy/collections')
}

export function getCollection(code: string): Promise<CollectionDetail> {
  return apiRequest<CollectionDetail>(`/api/economy/collections/${encodeURIComponent(code)}`)
}

export function claimCollection(code: string): Promise<CollectionClaimResponse> {
  return apiRequest<CollectionClaimResponse>(
    `/api/economy/collections/${encodeURIComponent(code)}/claim`,
    { method: 'POST' },
  )
}

export const collectionsApi = {
  getCollections,
  getCollection,
  claimCollection,
}
