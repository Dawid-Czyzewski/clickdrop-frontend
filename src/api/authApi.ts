import { apiRequest } from './client'

export type Role = 'USER' | 'ADMIN'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  id: number
  email: string
  role: Role
}

export type RegisterRequest = {
  email: string
  username: string
  password: string
}

export type RegisterResponse = {
  id: number
  email: string
  username: string
  role: Role
}

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  register(payload: RegisterRequest): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },
}
