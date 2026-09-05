import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VerifyEmailConfirm } from '../../src/components/auth/VerifyEmailConfirm'
import { ApiError } from '../../src/api/client'
import {
  clearPendingVerificationEmail,
  getPendingVerificationEmail,
  setPendingVerificationEmail,
} from '../../src/auth/pendingVerification'
import { clearVerifyEmailOnceCache } from '../../src/auth/verifyEmailOnce'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    verifyEmail: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const verifyMock = vi.mocked(authApi.verifyEmail)

describe('VerifyEmailConfirm', () => {
  beforeEach(() => {
    clearPendingVerificationEmail()
    clearVerifyEmailOnceCache()
    verifyMock.mockReset()
  })

  it('shows success and login button', async () => {
    setPendingVerificationEmail('player@clickdrop.test')
    verifyMock.mockResolvedValue({ message: 'Email verified successfully' })

    renderWithProviders(<VerifyEmailConfirm token="good-token" />)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Email confirmed. You can sign in now.',
      )
    })
    expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute('href', '/login')
    expect(getPendingVerificationEmail()).toBeNull()
    expect(verifyMock).toHaveBeenCalledWith('good-token')
  })

  it('shows invalid token screen', async () => {
    verifyMock.mockRejectedValue(new ApiError(400, 'Invalid verification token'))

    renderWithProviders(<VerifyEmailConfirm token="bad-token" />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This verification link is invalid.',
    )
  })

  it('shows expired token screen', async () => {
    verifyMock.mockRejectedValue(new ApiError(400, 'Verification token is Expired'))

    renderWithProviders(<VerifyEmailConfirm token="old-token" />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'This verification link has expired.',
      )
    })
  })
})
