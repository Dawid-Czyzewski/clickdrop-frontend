import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VerifyEmailPanel } from '../../src/components/auth/VerifyEmailPanel'
import { ApiError } from '../../src/api/client'
import {
  clearPendingVerificationEmail,
  setPendingVerificationEmail,
} from '../../src/auth/pendingVerification'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    resendVerification: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const resendMock = vi.mocked(authApi.resendVerification)

function renderVerifyEmailPanel(email = 'player@clickdrop.test') {
  setPendingVerificationEmail(email)
  return renderWithProviders(<VerifyEmailPanel />)
}

describe('VerifyEmailPanel', () => {
  beforeEach(() => {
    clearPendingVerificationEmail()
    resendMock.mockReset()
  })

  it('shows email and login link', () => {
    renderVerifyEmailPanel('player@clickdrop.test')

    expect(screen.getByText('We sent an activation link to:')).toBeInTheDocument()
    expect(screen.getByText('player@clickdrop.test')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to login/i })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('redirects to register when email is missing', async () => {
    renderWithProviders(<VerifyEmailPanel />)

    await waitFor(() => {
      expect(getMockRouter().replace).toHaveBeenCalledWith('/register')
    })
  })

  it('uses pending email from session storage', () => {
    setPendingVerificationEmail('stored@clickdrop.test')
    renderWithProviders(<VerifyEmailPanel />)

    expect(screen.getByText('stored@clickdrop.test')).toBeInTheDocument()
  })

  it('disables the button while sending', async () => {
    const user = userEvent.setup()
    let resolveRequest: (() => void) | undefined
    resendMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = () => resolve(undefined)
        }),
    )

    renderVerifyEmailPanel()
    const button = screen.getByRole('button', { name: /resend email/i })
    await user.click(button)

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveTextContent('Sending…')

    resolveRequest?.()
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it('resends email and shows success status', async () => {
    const user = userEvent.setup()
    resendMock.mockResolvedValue(undefined)

    renderVerifyEmailPanel()
    await user.click(screen.getByRole('button', { name: /resend email/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Email sent again.')
    })

    expect(resendMock).toHaveBeenCalledWith({ email: 'player@clickdrop.test' })
  })

  it('shows error when resend fails', async () => {
    const user = userEvent.setup()
    resendMock.mockRejectedValue(new ApiError(500, 'fail'))

    renderVerifyEmailPanel()
    await user.click(screen.getByRole('button', { name: /resend email/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not resend the email.',
    )
  })
})
