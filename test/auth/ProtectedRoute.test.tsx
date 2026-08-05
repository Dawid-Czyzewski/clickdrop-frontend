import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProtectedRoute } from '../../src/auth/ProtectedRoute'
import { setAuthUser } from '../../src/auth/session'
import { renderWithProviders } from '../utils/render'

function renderProtected() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<div>Login page</div>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div>Protected dashboard</div>} />
      </Route>
    </Routes>,
    { routerProps: { initialEntries: ['/dashboard'] } },
  )
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderProtected()
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    setAuthUser({
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })

    renderProtected()
    expect(screen.getByText('Protected dashboard')).toBeInTheDocument()
  })
})
