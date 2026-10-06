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
  incomePerSecond: number
}

export type BuyUpgradeResponse = {
  upgradeId: number
  code: string
  level: number
  balance: number
  cost: number
}

export type ClickPowerResponse = {
  rewardPerClick: number
}

export type IdleCollectResponse = {
  earned: number
  balance: number
  incomePerSecond: number
}

export type IdleStatusResponse = {
  pending: number
  incomePerSecond: number
  lastIdleCollectedAt: string
}

export function getBalance(): Promise<BalanceResponse> {
  return apiRequest<BalanceResponse>('/api/economy/balance')
}

export function getClickPower(): Promise<ClickPowerResponse> {
  return apiRequest<ClickPowerResponse>('/api/economy/click-power')
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

export function getIdleStatus(): Promise<IdleStatusResponse> {
  return apiRequest<IdleStatusResponse>('/api/economy/idle')
}

export function collectIdle(): Promise<IdleCollectResponse> {
  return apiRequest<IdleCollectResponse>('/api/economy/idle/collect', {
    method: 'POST',
  })
}

export const economyApi = {
  getBalance,
  getClickPower,
  clickToEarn,
  getMyUpgrades,
  buyUpgrade,
  getIdleStatus,
  collectIdle,
}
