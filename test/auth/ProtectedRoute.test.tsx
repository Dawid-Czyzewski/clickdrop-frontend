import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProtectedRoute } from '../../src/auth/ProtectedRoute'
import { authService } from '../../src/auth/authService'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', async () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected dashboard</div>
      </ProtectedRoute>,
    )

    await waitFor(() => {
      expect(getMockRouter().replace).toHaveBeenCalledWith('/login')
    })
    expect(screen.queryByText('Protected dashboard')).not.toBeInTheDocument()
  })

  it('renders protected content for authenticated users', async () => {
    authService.setSession({
      token: 'jwt-protected',
      refreshToken: 'refresh-protected',
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected dashboard</div>
      </ProtectedRoute>,
    )

    expect(await screen.findByText('Protected dashboard')).toBeInTheDocument()
  })
})
