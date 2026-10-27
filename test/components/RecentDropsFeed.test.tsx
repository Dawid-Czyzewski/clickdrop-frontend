import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RecentDropsFeed } from '../../src/components/home/RecentDropsFeed'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/dropsApi', () => ({
  getRecentDrops: vi.fn(),
}))

vi.mock('../../src/api/casesApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/api/casesApi')>()
  return {
    ...actual,
    getCases: vi.fn(),
    getCaseDrops: vi.fn(),
  }
})

import { getCaseDrops, getCases } from '../../src/api/casesApi'
import { getRecentDrops } from '../../src/api/dropsApi'
import { resetCaseLookupCache } from '../../src/hooks/useCaseLookup'

const getRecentDropsMock = vi.mocked(getRecentDrops)
const getCasesMock = vi.mocked(getCases)
const getCaseDropsMock = vi.mocked(getCaseDrops)

describe('RecentDropsFeed', () => {
  beforeEach(() => {
    authService.logout()
    getRecentDropsMock.mockReset()
    getCasesMock.mockReset()
    getCaseDropsMock.mockReset()
    resetCaseLookupCache()
    getCasesMock.mockResolvedValue([])
    getCaseDropsMock.mockResolvedValue([])
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
    expect(document.querySelector('img')).toHaveAttribute('src', '/items/AK_47_SLATE.webp')
    expect(
      screen.getByRole('link', { name: /browse cases for ak-47 \| slate/i }),
    ).toHaveAttribute('href', '/#cases')
    expect(getRecentDropsMock).toHaveBeenCalled()
  })

  it('links chip to case detail when caseId is present', async () => {
    getRecentDropsMock.mockResolvedValue([
      {
        itemCode: 'AK_47_SLATE',
        displayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        statTrack: false,
        source: 'CASE',
        caseId: 10,
        caseCode: 'REVOLUTION_CASE',
        createdAt: '2026-04-01T12:00:00Z',
      },
    ])

    renderWithProviders(<RecentDropsFeed />)

    expect(
      await screen.findByRole('link', { name: /open case for ak-47 \| slate/i }),
    ).toHaveAttribute('href', '/cases/10')
  })

  it('falls back to cases section when caseId and catalog miss', async () => {
    getRecentDropsMock.mockResolvedValue([
      {
        itemCode: 'AK_47_SLATE',
        displayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        statTrack: false,
        source: 'CASE',
        createdAt: '2026-04-01T12:00:00Z',
      },
    ])

    renderWithProviders(<RecentDropsFeed />)

    expect(
      await screen.findByRole('link', { name: /browse cases for ak-47 \| slate/i }),
    ).toHaveAttribute('href', '/#cases')
  })

  it('resolves case from catalog when API omits caseId', async () => {
    getRecentDropsMock.mockResolvedValue([
      {
        itemCode: 'SCAR_20_ASSAULT',
        displayName: 'SCAR-20 | Assault',
        rarity: 'MIL_SPEC',
        exterior: 'WELL_WORN',
        statTrack: false,
        source: 'CASE',
        createdAt: '2026-04-01T12:00:00Z',
      },
    ])
    getCasesMock.mockResolvedValue([
      {
        id: 19,
        code: 'CS20_CASE',
        displayName: 'CS20 Case',
        price: 65,
        sortOrder: 11,
        minLevel: 1,
      },
    ])
    getCaseDropsMock.mockResolvedValue([
      {
        itemId: 1,
        code: 'SCAR_20_ASSAULT',
        displayName: 'SCAR-20 | Assault',
        rarity: 'MIL_SPEC',
        weight: 1,
      },
    ])

    renderWithProviders(<RecentDropsFeed />)

    expect(
      await screen.findByRole('link', { name: /open case for scar-20 \| assault/i }),
    ).toHaveAttribute('href', '/cases/19')
  })

  it('links daily drops to daily page', async () => {
    getRecentDropsMock.mockResolvedValue([
      {
        itemCode: 'AK_47_SLATE',
        displayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        statTrack: false,
        source: 'DAILY',
        createdAt: '2026-04-01T12:00:00Z',
      },
    ])

    renderWithProviders(<RecentDropsFeed />)

    expect(
      await screen.findByRole('link', { name: /open daily free for ak-47 \| slate/i }),
    ).toHaveAttribute('href', '/daily')
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
