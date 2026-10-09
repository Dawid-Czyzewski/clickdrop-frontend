import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CaseOpenHistoryPanel } from '../../src/components/cases/CaseOpenHistoryPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getMyCaseOpens: vi.fn(),
}))

import { getMyCaseOpens } from '../../src/api/casesApi'

const getMyCaseOpensMock = vi.mocked(getMyCaseOpens)

function login() {
  authService.setSession({
    token: 'access',
    refreshToken: 'refresh',
    id: 1,
    email: 'user@example.com',
    role: 'USER',
  })
}

describe('CaseOpenHistoryPanel', () => {
  beforeEach(() => {
    authService.logout()
    getMyCaseOpensMock.mockReset()
  })

  it('asks guests to sign in', () => {
    renderWithProviders(<CaseOpenHistoryPanel />)

    expect(screen.getByText(/sign in to see your case history/i)).toBeInTheDocument()
    expect(getMyCaseOpensMock).not.toHaveBeenCalled()
  })

  it('lists opens with rarity, exterior, and date', async () => {
    login()
    getMyCaseOpensMock.mockResolvedValue([
      {
        itemCode: 'AK_47_SLATE',
        displayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        statTrack: true,
        createdAt: '2026-04-01T12:00:00Z',
      },
    ])

    renderWithProviders(<CaseOpenHistoryPanel />)

    expect(await screen.findByRole('heading', { name: /case history/i })).toBeInTheDocument()
    expect(await screen.findByText(/ak-47 \| slate/i)).toBeInTheDocument()
    expect(screen.getByText(/field-tested/i)).toBeInTheDocument()
    expect(screen.getByText('StatTrack')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /ak-47 \| slate/i })).toHaveAttribute(
      'src',
      '/items/AK_47_SLATE.webp',
    )
  })

  it('shows empty state', async () => {
    login()
    getMyCaseOpensMock.mockResolvedValue([])

    renderWithProviders(<CaseOpenHistoryPanel />)

    expect(await screen.findByText(/no history yet/i)).toBeInTheDocument()
  })

  it('shows error state', async () => {
    login()
    getMyCaseOpensMock.mockRejectedValue(new Error('boom'))

    renderWithProviders(<CaseOpenHistoryPanel />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
