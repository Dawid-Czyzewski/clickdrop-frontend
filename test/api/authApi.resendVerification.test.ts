import { describe, expect, it, vi } from 'vitest'
import { authApi } from '../../src/api/authApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('authApi.resendVerification', () => {
  it('posts email to /api/auth/resend-verification', async () => {
    requestMock.mockResolvedValue({ data: undefined })

    await expect(
      authApi.resendVerification({ email: 'player@clickdrop.test' }),
    ).resolves.toBeUndefined()

    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/auth/resend-verification',
      method: 'POST',
      data: { email: 'player@clickdrop.test' },
      headers: undefined,
      skipAuth: true,
    })
  })
})
