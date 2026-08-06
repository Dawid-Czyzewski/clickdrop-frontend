import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { setSession, getAuthUser } from '../../src/auth/session'
import { renderWithProviders } from '../utils/render'
import { Route, Routes } from 'react-router-dom'

describe('DashboardPage', () => {
  it('shows signed-in user details', () => {
    setSession({
      token: 'jwt-dash',
      id: 3,
      email: 'dash@clickdrop.test',
      role: 'ADMIN',
    })

    renderWithProviders(<DashboardPage />)

    expect(screen.getByText('dash@clickdrop.test')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('logs out and navigates to login', async () => {
    const user = userEvent.setup()
    setSession({
      token: 'jwt-dash',
      id: 3,
      email: 'dash@clickdrop.test',
      role: 'USER',
    })

    renderWithProviders(
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>,
      { routerProps: { initialEntries: ['/'] } },
    )

    await user.click(screen.getByRole('button', { name: /log out/i }))

    expect(getAuthUser()).toBeNull()
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })
})
