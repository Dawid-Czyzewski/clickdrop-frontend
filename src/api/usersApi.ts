import { apiRequest } from './client'

export type CurrentUser = {
  username: string
  email: string
  level: number
  experience: number
  clickDollars: number
}

export function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/api/users/me')
}

export const usersApi = {
  getCurrentUser,
}
