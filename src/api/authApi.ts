import { apiRequest } from './client'

export type Role = 'USER' | 'ADMIN'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  refreshToken: string
  id: number
  email: string
  role: Role
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
}

export type RefreshTokenRequest = {
  refreshToken: string
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

export type ResendVerificationRequest = {
  email: string
}

export type VerifyEmailResponse = {
  message: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  token: string
  newPassword: string
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  refresh(payload: RefreshTokenRequest): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/api/auth/refresh', {
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

  resendVerification(payload: ResendVerificationRequest): Promise<void> {
    return apiRequest<void>('/api/auth/resend-verification', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const query = new URLSearchParams({ token }).toString()
    return apiRequest<VerifyEmailResponse>(`/api/auth/verify-email?${query}`, {
      method: 'GET',
      auth: false,
    })
  },

  forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    return apiRequest<void>('/api/auth/forgot-password', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  resetPassword(payload: ResetPasswordRequest): Promise<void> {
    return apiRequest<void>('/api/auth/reset-password', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },

  changePassword(payload: ChangePasswordRequest): Promise<void> {
    return apiRequest<void>('/api/auth/change-password', {
      method: 'POST',
      body: payload,
    })
  },
}
