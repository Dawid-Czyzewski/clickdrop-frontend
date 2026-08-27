import { authApi } from '../api/authApi'

const verifyRequests = new Map<string, Promise<void>>()

export function verifyEmailOnce(token: string): Promise<void> {
  const existing = verifyRequests.get(token)
  if (existing) {
    return existing
  }

  const request = authApi.verifyEmail(token).then(() => undefined)
  verifyRequests.set(token, request)

  request.catch(() => {
    verifyRequests.delete(token)
  })

  return request
}

export function clearVerifyEmailOnceCache(): void {
  verifyRequests.clear()
}
