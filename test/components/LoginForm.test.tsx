import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from '../../src/components/auth/LoginForm'
import { ApiError } from '../../src/api/client'
import { authService } from '../../src/auth/authService'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const loginMock = vi.mocked(authApi.login)

describe('LoginForm', () => {
  it('logs in, stores user and redirects to home', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValue({
      token: 'jwt-ok',
      refreshToken: 'refresh-ok',
      id: 7,
      email: 'ok@clickdrop.test',
      role: 'USER',
    })

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'ok@clickdrop.test')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(getMockRouter().replace).toHaveBeenCalledWith('/')
    })

    expect(loginMock).toHaveBeenCalledWith({
      email: 'ok@clickdrop.test',
      password: 'secret',
    })
    expect(authService.getAuthUser()).toEqual({
      id: 7,
      email: 'ok@clickdrop.test',
      role: 'USER',
    })
    expect(localStorage.getItem('clickdrop_auth_token')).toBe('jwt-ok')
    expect(localStorage.getItem('clickdrop_auth_refresh_token')).toBe('refresh-ok')
  })

  it('shows invalid credentials on 401', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValue(new ApiError(401, 'Unauthorized'))

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'bad@clickdrop.test')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid email or password.',
    )
    expect(authService.getAuthUser()).toBeNull()
  })

  it('redirects unverified account to verify email', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValue(
      new ApiError(403, 'Account is not verified. Please confirm your email'),
    )

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'pending@clickdrop.test')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(getMockRouter().replace).toHaveBeenCalledWith('/verify-email')
    })

    expect(authService.getAuthUser()).toBeNull()
    expect(localStorage.getItem('clickdrop_auth_token')).toBeNull()
  })

  it('shows network error when request fails unexpectedly', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValue(new Error('offline'))

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'net@clickdrop.test')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not reach the server. Please try again.',
    )
  })
})
