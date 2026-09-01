import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from '../../src/components/auth/LoginForm'
import { ApiError } from '../../src/api/client'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const loginMock = vi.mocked(authApi.login)

function renderLoginForm() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<div>Dashboard page</div>} />
      <Route path="/verify-email" element={<div>Verify email page</div>} />
    </Routes>,
    { routerProps: { initialEntries: ['/login'] } },
  )
}

describe('LoginForm', () => {
  it('logs in, stores user and redirects to dashboard', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValue({
      token: 'jwt-ok',
      id: 7,
      email: 'ok@clickdrop.test',
      role: 'USER',
    })

    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'ok@clickdrop.test')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Dashboard page')).toBeInTheDocument()
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
  })

  it('shows invalid credentials on 401', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValue(new ApiError(401, 'Unauthorized'))

    renderLoginForm()

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

    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'pending@clickdrop.test')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Verify email page')).toBeInTheDocument()
    })

    expect(authService.getAuthUser()).toBeNull()
    expect(localStorage.getItem('clickdrop_auth_token')).toBeNull()
  })

  it('shows network error when request fails unexpectedly', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValue(new Error('offline'))

    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'net@clickdrop.test')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not reach the server. Please try again.',
    )
  })
})
