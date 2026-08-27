import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearVerifyEmailOnceCache, verifyEmailOnce } from '../../src/auth/verifyEmailOnce'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    verifyEmail: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const verifyMock = vi.mocked(authApi.verifyEmail)

describe('verifyEmailOnce', () => {
  beforeEach(() => {
    clearVerifyEmailOnceCache()
    verifyMock.mockReset()
  })

  it('calls API only once for the same token', async () => {
    verifyMock.mockResolvedValue({ message: 'ok' })

    await Promise.all([
      verifyEmailOnce('same-token'),
      verifyEmailOnce('same-token'),
      verifyEmailOnce('same-token'),
    ])

    expect(verifyMock).toHaveBeenCalledTimes(1)
    expect(verifyMock).toHaveBeenCalledWith('same-token')
  })

  it('allows retry after a failed verification', async () => {
    verifyMock
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ message: 'ok' })

    await expect(verifyEmailOnce('retry-token')).rejects.toThrow('fail')
    await expect(verifyEmailOnce('retry-token')).resolves.toBeUndefined()

    expect(verifyMock).toHaveBeenCalledTimes(2)
  })
})
