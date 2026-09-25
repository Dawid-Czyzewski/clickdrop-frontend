import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavStatsBar } from '../../src/components/home/NavStatsBar'
import { setMockPathname } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

describe('NavStatsBar', () => {
  it('shows upgrades, inventory, and daily links', () => {
    setMockPathname('/')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /upgrades shop/i })).toHaveAttribute(
      'href',
      '/upgrades',
    )
    expect(screen.getByRole('link', { name: /inventory/i })).toHaveAttribute(
      'href',
      '/inventory',
    )
    expect(screen.getByRole('link', { name: /daily free/i })).toHaveAttribute('href', '/daily')
  })

  it('marks daily as active on /daily', () => {
    setMockPathname('/daily')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /daily free/i }).className).toContain(
      'border-emerald-400',
    )
  })
})
