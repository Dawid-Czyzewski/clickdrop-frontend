import { apiRequest } from './client'

export type CurrentUser = {
  username: string
  email: string
  level: number
  experience: number
  clickDollars: number
}

export type LeaderboardEntry = {
  rank: number
  username: string
  level: number
  experience: number
}

export type MyLeaderboardRank = LeaderboardEntry

export function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/api/users/me')
}

export function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const query = limit > 0 ? `?limit=${limit}` : ''
  return apiRequest<LeaderboardEntry[]>(`/api/users/leaderboard${query}`, {
    auth: false,
  })
}

export function getMyLeaderboardRank(): Promise<MyLeaderboardRank> {
  return apiRequest<MyLeaderboardRank>('/api/users/leaderboard/me')
}

export const usersApi = {
  getCurrentUser,
  getLeaderboard,
  getMyLeaderboardRank,
}
