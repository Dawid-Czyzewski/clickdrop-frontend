import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ForgotPasswordForm } from '../../src/components/auth/ForgotPasswordForm'
import { ApiError } from '../../src/api/client'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    forgotPassword: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const forgotMock = vi.mocked(authApi.forgotPassword)

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    forgotMock.mockReset()
  })

  it('sends reset email and shows success', async () => {
    const user = userEvent.setup()
    forgotMock.mockResolvedValue(undefined)

    renderWithProviders(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText(/^email$/i), 'player@clickdrop.test')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(forgotMock).toHaveBeenCalledWith({ email: 'player@clickdrop.test' })
    })
    expect(
      await screen.findByText(/if an account exists for that email/i),
    ).toBeInTheDocument()
  })

  it('shows validation error on 400', async () => {
    const user = userEvent.setup()
    forgotMock.mockRejectedValue(new ApiError(400, 'bad'))

    renderWithProviders(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText(/^email$/i), 'bad@clickdrop.test')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /please enter a valid email/i,
    )
  })
})
