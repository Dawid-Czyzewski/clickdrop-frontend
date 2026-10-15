import { ApiError } from '../api/client'

export function resolveForgotPasswordError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return t('forgotPassword.validationError')
    if (err.status >= 500) return t('forgotPassword.errorServer')
    return t('forgotPassword.error')
  }

  return t('forgotPassword.networkError')
}

export function resolveResetPasswordError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    const message = err.message.toLowerCase()
    if (message.includes('expired')) return t('resetPassword.expired')
    if (message.includes('invalid') || err.status === 400) return t('resetPassword.invalid')
    if (err.status >= 500) return t('resetPassword.errorServer')
    return t('resetPassword.error')
  }

  return t('resetPassword.networkError')
}
