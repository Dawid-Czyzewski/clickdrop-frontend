import { describe, expect, it, vi } from 'vitest'
import { authApi } from '../../src/api/authApi'

describe('authApi.verifyEmail', () => {
  it('calls GET /api/auth/verify-email with token query', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ message: 'Email verified successfully' }),
      }),
    )

    const result = await authApi.verifyEmail('activation-token')

    expect(result).toEqual({ message: 'Email verified successfully' })
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/auth/verify-email?token=activation-token',
      expect.objectContaining({ method: 'GET' }),
    )
  })
})
