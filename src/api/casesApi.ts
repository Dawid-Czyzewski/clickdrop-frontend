import { apiRequest } from './client'

export type ItemRarity = 'MIL_SPEC' | 'RESTRICTED' | 'CLASSIFIED' | 'COVERT'

export type ItemExterior =
  | 'FACTORY_NEW'
  | 'MINIMAL_WEAR'
  | 'FIELD_TESTED'
  | 'WELL_WORN'
  | 'BATTLE_SCARRED'

export type GameCase = {
  id: number
  code: string
  displayName: string
  price: number
  sortOrder: number
}

export type CaseDrop = {
  itemId: number
  code: string
  displayName: string
  rarity: ItemRarity
  weight: number
}

export type OpenCaseResponse = {
  inventoryItemId: number
  itemCode: string
  itemDisplayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack?: boolean
  balance: number
  cost: number
  suggestedSellPrice: number
  experienceGained?: number
  level?: number
  experience?: number
}

export type InventoryItem = {
  inventoryItemId: number
  itemId: number
  code: string
  displayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack?: boolean
  suggestedSellPrice: number
  createdAt: string
}

export type SellInventoryItemResponse = {
  balance: number
  soldFor: number
}

export type SellSkipReason = 'NOT_FOUND' | 'NOT_OWNED'

export type SoldInventoryItem = {
  inventoryItemId: number
  itemCode: string
  earned: number
}

export type SkippedInventoryItem = {
  inventoryItemId: number
  reason: SellSkipReason
}

export type SellInventoryBatchResponse = {
  soldCount: number
  totalEarned: number
  balance: number
  sold: SoldInventoryItem[]
  skipped: SkippedInventoryItem[]
}

export type CaseOpenHistoryItem = {
  itemCode: string
  displayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack: boolean
  createdAt: string
}

export function getCases(): Promise<GameCase[]> {
  return apiRequest<GameCase[]>('/api/economy/cases', { auth: false })
}

export function getCaseDrops(caseId: number): Promise<CaseDrop[]> {
  return apiRequest<CaseDrop[]>(`/api/economy/cases/${caseId}/drops`, { auth: false })
}

export function openCase(caseId: number): Promise<OpenCaseResponse> {
  return apiRequest<OpenCaseResponse>(`/api/economy/cases/${caseId}/open`, {
    method: 'POST',
  })
}

export function getInventory(): Promise<InventoryItem[]> {
  return apiRequest<InventoryItem[]>('/api/economy/inventory/me')
}

export function sellInventoryItem(inventoryItemId: number): Promise<SellInventoryItemResponse> {
  return apiRequest<SellInventoryItemResponse>(
    `/api/economy/inventory/${inventoryItemId}/sell`,
    { method: 'POST' },
  )
}

export function sellInventoryBatch(
  inventoryItemIds: number[],
): Promise<SellInventoryBatchResponse> {
  return apiRequest<SellInventoryBatchResponse>('/api/economy/inventory/sell-batch', {
    method: 'POST',
    body: { inventoryItemIds },
  })
}

export function getMyCaseOpens(limit = 20): Promise<CaseOpenHistoryItem[]> {
  const query = limit > 0 ? `?limit=${limit}` : ''
  return apiRequest<CaseOpenHistoryItem[]>(`/api/economy/cases/opens/me${query}`)
}

export const casesApi = {
  getCases,
  getCaseDrops,
  openCase,
  getInventory,
  sellInventoryItem,
  sellInventoryBatch,
  getMyCaseOpens,
}
