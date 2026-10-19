import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LogoutAllSection } from '../../src/components/settings/LogoutAllSection'
import { ApiError } from '../../src/api/client'
import { authService } from '../../src/auth/authService'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    logoutAll: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const logoutAllMock = vi.mocked(authApi.logoutAll)

describe('LogoutAllSection', () => {
  beforeEach(() => {
    authService.logout()
    logoutAllMock.mockReset()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
  })

  it('confirms, revokes sessions, clears tokens, and goes to login', async () => {
    const user = userEvent.setup()
    logoutAllMock.mockResolvedValue(undefined)

    renderWithProviders(<LogoutAllSection />)

    await user.click(screen.getByRole('button', { name: /log out everywhere/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const confirmButtons = screen.getAllByRole('button', { name: /log out everywhere/i })
    await user.click(confirmButtons[confirmButtons.length - 1]!)

    await waitFor(() => {
      expect(logoutAllMock).toHaveBeenCalled()
    })
    expect(authService.hasActiveSession()).toBe(false)
    expect(getMockRouter().replace).toHaveBeenCalledWith('/login')
  })

  it('shows error and keeps session when request fails', async () => {
    const user = userEvent.setup()
    logoutAllMock.mockRejectedValue(new ApiError(503, 'down'))

    renderWithProviders(<LogoutAllSection />)

    await user.click(screen.getByRole('button', { name: /log out everywhere/i }))
    const dialogButtons = screen.getAllByRole('button', { name: /log out everywhere/i })
    await user.click(dialogButtons[dialogButtons.length - 1]!)

    expect(await screen.findByRole('alert')).toHaveTextContent(/auth service is unavailable/i)
    expect(authService.hasActiveSession()).toBe(true)
    expect(getMockRouter().replace).not.toHaveBeenCalledWith('/login')
  })
})
