import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavStatsBar } from '../../src/components/home/NavStatsBar'
import { setMockPathname } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

describe('NavStatsBar', () => {
  it('shows cases and upgrades shop links with stats', () => {
    setMockPathname('/')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /cases/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /upgrades shop/i })).toHaveAttribute(
      'href',
      '/upgrades',
    )
    expect(screen.getByText(/cases opened/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /event/i })).not.toBeInTheDocument()
  })

  it('marks upgrades shop as active on /upgrades', () => {
    setMockPathname('/upgrades')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /upgrades shop/i }).className).toContain(
      'border-emerald-400',
    )
  })
})
