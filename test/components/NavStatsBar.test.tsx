import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavStatsBar } from '../../src/components/home/NavStatsBar'
import { setMockPathname } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

describe('NavStatsBar', () => {
  it('shows cases, history, upgrades, skins, inventory, daily, ranks, and settings links', () => {
    setMockPathname('/')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /^cases$/i })).toHaveAttribute('href', '/#cases')
    expect(screen.getByRole('link', { name: /^history$/i })).toHaveAttribute(
      'href',
      '/cases/opens',
    )
    expect(screen.getByRole('link', { name: /^upgrades$/i })).toHaveAttribute(
      'href',
      '/upgrades',
    )
    expect(screen.getByRole('link', { name: /^skins$/i })).toHaveAttribute(
      'href',
      '/skin-upgrade',
    )
    expect(screen.getByRole('link', { name: /inventory/i })).toHaveAttribute(
      'href',
      '/inventory',
    )
    expect(screen.getByRole('link', { name: /^daily$/i })).toHaveAttribute('href', '/daily')
    expect(screen.getByRole('link', { name: /^ranks$/i })).toHaveAttribute(
      'href',
      '/leaderboard',
    )
    expect(screen.getByRole('link', { name: /^settings$/i })).toHaveAttribute(
      'href',
      '/settings',
    )
  })

  it('marks cases as active pill on home', () => {
    setMockPathname('/')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /^cases$/i }).className).toContain('bg-cd-accent')
  })

  it('marks daily as active on /daily', () => {
    setMockPathname('/daily')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /^daily$/i }).className).toContain(
      'border-cd-accent',
    )
  })
})
