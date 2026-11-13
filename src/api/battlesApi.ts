import { apiRequest } from './client'
import type { ItemExterior, ItemRarity } from './casesApi'

export type BattleStatus = 'WAITING' | 'FINISHED'

export type BattleSide = 'PLAYER1' | 'PLAYER2'

export type BattleDrop = {
  roundIndex: number
  side: BattleSide
  itemId: number
  itemCode: string
  itemDisplayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack: boolean
  floatValue: number
  paintSeed: number
  value: number
  inventoryItemId: number | null
}

export type BattleResponse = {
  id: number
  caseId: number
  rounds: number 
  status: BattleStatus
  player1UserId: number
  player2UserId: number | null
  player1TotalValue: number
  player2TotalValue: number
  winnerUserId: number | null
  entryCost: number
  roundsDrops: BattleDrop[]
}

export type CreateBattleRequest = {
  caseId: number
  rounds: 1 | 3 | 5
  vsBot?: boolean
}

export function createBattle(body: CreateBattleRequest): Promise<BattleResponse> {
  return apiRequest<BattleResponse>('/api/economy/battles', {
    method: 'POST',
    body,
  })
}

export function joinBattle(battleId: number): Promise<BattleResponse> {
  return apiRequest<BattleResponse>(`/api/economy/battles/${battleId}/join`, {
    method: 'POST',
  })
}

export function getBattle(battleId: number): Promise<BattleResponse> {
  return apiRequest<BattleResponse>(`/api/economy/battles/${battleId}`)
}

export const battlesApi = { createBattle, joinBattle, getBattle }
