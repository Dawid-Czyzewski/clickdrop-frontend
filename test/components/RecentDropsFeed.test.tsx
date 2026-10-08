import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RecentDropsFeed } from '../../src/components/home/RecentDropsFeed'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/dropsApi', () => ({
  getRecentDrops: vi.fn(),
}))

import { getRecentDrops } from '../../src/api/dropsApi'

const getRecentDropsMock = vi.mocked(getRecentDrops)

describe('RecentDropsFeed', () => {
  beforeEach(() => {
    authService.logout()
    getRecentDropsMock.mockReset()
  })

  it('shows drops for guests', async () => {
    getRecentDropsMock.mockResolvedValue([
      {
        itemCode: 'AK_47_SLATE',
        displayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        statTrack: true,
        source: 'CASE',
        createdAt: '2026-04-01T12:00:00Z',
      },
    ])

    renderWithProviders(<RecentDropsFeed />)

    expect(await screen.findByRole('heading', { name: /recent drops/i })).toBeInTheDocument()
    expect(await screen.findByText(/ak-47 \| slate/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /ak-47 \| slate/i })).toHaveAttribute(
      'src',
      '/items/AK_47_SLATE.webp',
    )
    expect(getRecentDropsMock).toHaveBeenCalled()
  })

  it('shows empty state', async () => {
    getRecentDropsMock.mockResolvedValue([])

    renderWithProviders(<RecentDropsFeed />)

    expect(await screen.findByText(/no drops yet/i)).toBeInTheDocument()
  })

  it('shows error state', async () => {
    getRecentDropsMock.mockRejectedValue(new Error('boom'))

    renderWithProviders(<RecentDropsFeed />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load recent drops/i)
  })
})
