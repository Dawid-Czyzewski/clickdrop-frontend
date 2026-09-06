import { apiRequest } from './client'

export type BalanceResponse = {
  balance: number
}

export type ClickToEarnResponse = {
  balance: number
  earned: number
}

export function getBalance(): Promise<BalanceResponse> {
  return apiRequest<BalanceResponse>('/api/economy/balance')
}

export function clickToEarn(): Promise<ClickToEarnResponse> {
  return apiRequest<ClickToEarnResponse>('/api/economy/click', {
    method: 'POST',
  })
}

export const economyApi = {
  getBalance,
  clickToEarn,
}
