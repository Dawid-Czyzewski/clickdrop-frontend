import { apiRequest } from './client'

export type BalanceResponse = {
  balance: number
}

export type ClickToEarnResponse = {
  balance: number
  earned: number
}

export type MyUpgrade = {
  id: number
  code: string
  tier: number
  price: number
  clickPower: number
  level: number
  nextCost: number
}

export type BuyUpgradeResponse = {
  upgradeId: number
  code: string
  level: number
  balance: number
  cost: number
}

export function getBalance(): Promise<BalanceResponse> {
  return apiRequest<BalanceResponse>('/api/economy/balance')
}

export function clickToEarn(): Promise<ClickToEarnResponse> {
  return apiRequest<ClickToEarnResponse>('/api/economy/click', {
    method: 'POST',
  })
}

export function getMyUpgrades(): Promise<MyUpgrade[]> {
  return apiRequest<MyUpgrade[]>('/api/economy/upgrades/me')
}

export function buyUpgrade(upgradeId: number): Promise<BuyUpgradeResponse> {
  return apiRequest<BuyUpgradeResponse>(`/api/economy/upgrades/${upgradeId}/buy`, {
    method: 'POST',
  })
}

export const economyApi = {
  getBalance,
  clickToEarn,
  getMyUpgrades,
  buyUpgrade,
}
