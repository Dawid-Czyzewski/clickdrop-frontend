import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RegisterForm } from '../../src/components/auth/RegisterForm'
import { ApiError } from '../../src/api/client'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    register: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const registerMock = vi.mocked(authApi.register)

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/username/i), 'playerone')
  await user.type(screen.getByLabelText(/^email$/i), 'player@clickdrop.test')
  await user.type(screen.getByLabelText(/^password$/i), 'secret123')
  await user.type(screen.getByLabelText(/confirm password/i), 'secret123')
}

describe('RegisterForm', () => {
  it('shows password mismatch error', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

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

    renderWithProviders(<RegisterForm />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(getMockRouter().replace).toHaveBeenCalledWith('/verify-email')
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

    renderWithProviders(<RegisterForm />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This email is already in use.',
    )
  })
})
