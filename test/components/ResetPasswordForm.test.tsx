import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResetPasswordForm } from '../../src/components/auth/ResetPasswordForm'
import { ApiError } from '../../src/api/client'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    resetPassword: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const resetMock = vi.mocked(authApi.resetPassword)

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    resetMock.mockReset()
  })

  it('resets password and redirects to login', async () => {
    const user = userEvent.setup()
    resetMock.mockResolvedValue(undefined)

    renderWithProviders(<ResetPasswordForm token="reset-token" />)

    await user.type(screen.getByLabelText(/^new password$/i), 'newsecret1')
    await user.type(screen.getByLabelText(/confirm password/i), 'newsecret1')
    await user.click(screen.getByRole('button', { name: /save new password/i }))

    await waitFor(() => {
      expect(resetMock).toHaveBeenCalledWith({
        token: 'reset-token',
        newPassword: 'newsecret1',
      })
    })
    expect(getMockRouter().replace).toHaveBeenCalledWith('/login')
  })

  it('blocks submit when passwords differ', async () => {
    const user = userEvent.setup()

    renderWithProviders(<ResetPasswordForm token="reset-token" />)

    await user.type(screen.getByLabelText(/^new password$/i), 'newsecret1')
    await user.type(screen.getByLabelText(/confirm password/i), 'otherpass')
    await user.click(screen.getByRole('button', { name: /save new password/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/passwords do not match/i)
    expect(resetMock).not.toHaveBeenCalled()
  })

  it('shows invalid token error', async () => {
    const user = userEvent.setup()
    resetMock.mockRejectedValue(new ApiError(400, 'Invalid password reset token'))

    renderWithProviders(<ResetPasswordForm token="bad-token" />)

    await user.type(screen.getByLabelText(/^new password$/i), 'newsecret1')
    await user.type(screen.getByLabelText(/confirm password/i), 'newsecret1')
    await user.click(screen.getByRole('button', { name: /save new password/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/reset link is invalid/i)
  })
})
