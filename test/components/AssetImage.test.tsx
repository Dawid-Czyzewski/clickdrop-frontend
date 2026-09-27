import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AssetImage } from '../../src/components/media/AssetImage'
import { CASE_FALLBACK_SRC, ITEM_FALLBACK_SRC } from '../../src/lib/assetPaths'
import { renderWithProviders } from '../utils/render'

describe('AssetImage', () => {
  it('renders case image for a known code', () => {
    renderWithProviders(<AssetImage kind="case" code="REVOLUTION_CASE" alt="Revolution Case" />)

    const img = screen.getByRole('img', { name: 'Revolution Case' })
    expect(img).toHaveAttribute('src', '/cases/REVOLUTION_CASE.webp')
  })

  it('renders item image for a known code', () => {
    renderWithProviders(<AssetImage kind="item" code="AK_47_SLATE" alt="AK" />)

    expect(screen.getByRole('img', { name: 'AK' })).toHaveAttribute(
      'src',
      '/items/AK_47_SLATE.webp',
    )
  })

  it('uses helper fallback src for unknown codes', () => {
    renderWithProviders(<AssetImage kind="case" code="MISSING_CASE" alt="Missing" />)

    expect(screen.getByRole('img', { name: 'Missing' })).toHaveAttribute(
      'src',
      CASE_FALLBACK_SRC,
    )
  })

  it('switches to fallback on image error without crashing', () => {
    renderWithProviders(<AssetImage kind="item" code="AK_47_SLATE" alt="Broken" />)

    const img = screen.getByRole('img', { name: 'Broken' })
    expect(img).toHaveAttribute('src', '/items/AK_47_SLATE.webp')

    fireEvent.error(img)

    expect(img).toHaveAttribute('src', ITEM_FALLBACK_SRC)
  })
})
