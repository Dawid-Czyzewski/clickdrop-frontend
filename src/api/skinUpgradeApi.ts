import type { ItemExterior, ItemRarity } from './casesApi'
import { apiRequest } from './client'

export type SkinUpgradeCurrent = {
  itemCode: string
  itemDisplayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack?: boolean
  suggestedSellPrice: number
}

export type SkinUpgradeTarget = {
  itemId: number
  itemCode: string
  itemDisplayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  suggestedSellPrice: number
}

export type SkinUpgradePreview = {
  inventoryItemId: number
  current: SkinUpgradeCurrent
  successChance: number
  possibleTargets: SkinUpgradeTarget[]
}

export type SkinUpgradeSuccess = {
  result: 'SUCCESS'
  inventoryItemId: number
  itemCode: string
  itemDisplayName: string
  rarity: ItemRarity
  exterior: ItemExterior
  statTrack?: boolean
  floatValue: number
  paintSeed: number
  suggestedSellPrice: number
}

export type SkinUpgradeFail = {
  result: 'FAIL'
}

export type SkinUpgradeResult = SkinUpgradeSuccess | SkinUpgradeFail

export type SkinUpgradeChoice = {
  targetItemId: number
  targetExterior: ItemExterior
}

export function getSkinUpgradePreview(inventoryItemId: number): Promise<SkinUpgradePreview> {
  return apiRequest<SkinUpgradePreview>(
    `/api/economy/inventory/${inventoryItemId}/upgrade-preview`,
  )
}

export function upgradeSkin(
  inventoryItemId: number,
  choice: SkinUpgradeChoice,
): Promise<SkinUpgradeResult> {
  return apiRequest<SkinUpgradeResult>(`/api/economy/inventory/${inventoryItemId}/upgrade`, {
    method: 'POST',
    body: choice,
  })
}

export function isSkinUpgradeSuccess(r: SkinUpgradeResult): r is SkinUpgradeSuccess {
  return r.result === 'SUCCESS'
}

export const skinUpgradeApi = {
  getSkinUpgradePreview,
  upgradeSkin,
}
