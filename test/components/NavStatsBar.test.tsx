import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavStatsBar } from '../../src/components/home/NavStatsBar'
import { setMockPathname } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

describe('NavStatsBar', () => {
  it('shows upgrades and inventory links with stats', () => {
    setMockPathname('/')
    renderWithProviders(<NavStatsBar />)

    expect(screen.queryByRole('link', { name: /^cases$/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /upgrades shop/i })).toHaveAttribute(
      'href',
      '/upgrades',
    )
    expect(screen.getByRole('link', { name: /inventory/i })).toHaveAttribute(
      'href',
      '/inventory',
    )
    expect(screen.getByText(/cases opened/i)).toBeInTheDocument()
  })

  it('marks upgrades as active on /upgrades', () => {
    setMockPathname('/upgrades')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /upgrades shop/i }).className).toContain(
      'border-emerald-400',
    )
  })
})
