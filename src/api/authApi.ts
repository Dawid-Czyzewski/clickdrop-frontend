import { apiRequest } from './client'

export type Role = 'USER' | 'ADMIN'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  id: number
  email: string
  role: Role
}

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
    })
  },
}
