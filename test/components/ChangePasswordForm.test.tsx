import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ChangePasswordForm } from '../../src/components/settings/ChangePasswordForm'
import { SettingsPanel } from '../../src/components/settings/SettingsPanel'
import { ApiError } from '../../src/api/client'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    changePassword: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const changeMock = vi.mocked(authApi.changePassword)

function login() {
  authService.setSession({
    token: 'jwt',
    refreshToken: 'refresh',
    id: 1,
    email: 'player@clickdrop.test',
    role: 'USER',
  })
}

describe('SettingsPanel', () => {
  beforeEach(() => {
    authService.logout()
    changeMock.mockReset()
  })

  it('asks guests to sign in', () => {
    renderWithProviders(<SettingsPanel />)

    expect(screen.getByText(/sign in to manage your settings/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
  })

  it('changes password for logged-in user', async () => {
    const user = userEvent.setup()
    login()
    changeMock.mockResolvedValue(undefined)

    renderWithProviders(<SettingsPanel />)

    await user.type(screen.getByLabelText(/current password/i), 'OldPass123!')
    await user.type(screen.getByLabelText(/^new password$/i), 'NewPass123!')
    await user.type(screen.getByLabelText(/confirm new password/i), 'NewPass123!')
    await user.click(screen.getByRole('button', { name: /save password/i }))

    await waitFor(() => {
      expect(changeMock).toHaveBeenCalledWith({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
      })
    })
    expect(await screen.findByRole('status')).toHaveTextContent(/password updated/i)
  })
})

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    changeMock.mockReset()
  })

  it('blocks when passwords do not match', async () => {
    const user = userEvent.setup()

    renderWithProviders(<ChangePasswordForm />)

    await user.type(screen.getByLabelText(/current password/i), 'OldPass123!')
    await user.type(screen.getByLabelText(/^new password$/i), 'NewPass123!')
    await user.type(screen.getByLabelText(/confirm new password/i), 'OtherPass1!')
    await user.click(screen.getByRole('button', { name: /save password/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/do not match/i)
    expect(changeMock).not.toHaveBeenCalled()
  })

  it('shows wrong current password error', async () => {
    const user = userEvent.setup()
    changeMock.mockRejectedValue(new ApiError(400, 'Current password is incorrect'))

    renderWithProviders(<ChangePasswordForm />)

    await user.type(screen.getByLabelText(/current password/i), 'WrongPass1!')
    await user.type(screen.getByLabelText(/^new password$/i), 'NewPass123!')
    await user.type(screen.getByLabelText(/confirm new password/i), 'NewPass123!')
    await user.click(screen.getByRole('button', { name: /save password/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/current password is incorrect/i)
  })
})
