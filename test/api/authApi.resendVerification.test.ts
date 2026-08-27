import { describe, expect, it, vi } from 'vitest'
import { authApi } from '../../src/api/authApi'

describe('authApi.resendVerification', () => {
  it('posts email to /api/auth/resend-verification', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        text: async () => '',
      }),
    )

    await expect(
      authApi.resendVerification({ email: 'player@clickdrop.test' }),
    ).resolves.toBeUndefined()

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/auth/resend-verification',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'player@clickdrop.test' }),
      }),
    )
  })
})
