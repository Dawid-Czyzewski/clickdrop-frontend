import { apiRequest } from './client'

export type BalanceResponse = {
  balance: number
}

export function getBalance(): Promise<BalanceResponse> {
  return apiRequest<BalanceResponse>('/api/economy/balance')
}

export const economyApi = {
  getBalance,
}
