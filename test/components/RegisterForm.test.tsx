import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RegisterForm } from '../../src/components/auth/RegisterForm'
import { ApiError } from '../../src/api/client'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    register: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const registerMock = vi.mocked(authApi.register)

function renderRegisterForm() {
  return renderWithProviders(
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-email" element={<div>Verify email page</div>} />
      <Route path="/login" element={<div>Login page</div>} />
    </Routes>,
    { routerProps: { initialEntries: ['/register'] } },
  )
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/username/i), 'playerone')
  await user.type(screen.getByLabelText(/^email$/i), 'player@clickdrop.test')
  await user.type(screen.getByLabelText(/^password$/i), 'secret123')
  await user.type(screen.getByLabelText(/confirm password/i), 'secret123')
}

describe('RegisterForm', () => {
  it('shows password mismatch error', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText(/username/i), 'playerone')
    await user.type(screen.getByLabelText(/^email$/i), 'player@clickdrop.test')
    await user.type(screen.getByLabelText(/^password$/i), 'secret123')
    await user.type(screen.getByLabelText(/confirm password/i), 'different')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Passwords do not match.')
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('registers and redirects to verify email', async () => {
    const user = userEvent.setup()
    registerMock.mockResolvedValue({
      id: 10,
      email: 'player@clickdrop.test',
      username: 'playerone',
      role: 'USER',
    })

    renderRegisterForm()
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Verify email page')).toBeInTheDocument()
    })

    expect(registerMock).toHaveBeenCalledWith({
      email: 'player@clickdrop.test',
      username: 'playerone',
      password: 'secret123',
    })
  })

  it('shows email taken error on 409', async () => {
    const user = userEvent.setup()
    registerMock.mockRejectedValue(new ApiError(409, 'Email already in use'))

    renderRegisterForm()
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This email is already in use.',
    )
  })
})
