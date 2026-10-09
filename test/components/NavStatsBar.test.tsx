import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavStatsBar } from '../../src/components/home/NavStatsBar'
import { setMockPathname } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

describe('NavStatsBar', () => {
  it('shows cases, history, upgrades, skin upgrade, inventory, and daily links', () => {
    setMockPathname('/')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /^cases$/i })).toHaveAttribute('href', '/#cases')
    expect(screen.getByRole('link', { name: /^history$/i })).toHaveAttribute(
      'href',
      '/cases/opens',
    )
    expect(screen.getByRole('link', { name: /upgrades shop/i })).toHaveAttribute(
      'href',
      '/upgrades',
    )
    expect(screen.getByRole('link', { name: /^skin upgrade$/i })).toHaveAttribute(
      'href',
      '/skin-upgrade',
    )
    expect(screen.getByRole('link', { name: /inventory/i })).toHaveAttribute(
      'href',
      '/inventory',
    )
    expect(screen.getByRole('link', { name: /daily free/i })).toHaveAttribute('href', '/daily')
  })

  it('marks cases as active pill on home', () => {
    setMockPathname('/')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /^cases$/i }).className).toContain('bg-cd-accent')
  })

  it('marks daily as active on /daily', () => {
    setMockPathname('/daily')
    renderWithProviders(<NavStatsBar />)

    expect(screen.getByRole('link', { name: /daily free/i }).className).toContain(
      'border-cd-accent',
    )
  })
})
