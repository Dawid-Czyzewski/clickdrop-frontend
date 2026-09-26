import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AssetImage } from '../../src/components/media/AssetImage'
import { CASE_FALLBACK_SRC, ITEM_FALLBACK_SRC } from '../../src/lib/assetPaths'
import { renderWithProviders } from '../utils/render'

describe('AssetImage', () => {
  it('renders case image for a known code', () => {
    renderWithProviders(<AssetImage kind="case" code="ANVIL" alt="Anvil" />)

    const img = screen.getByRole('img', { name: 'Anvil' })
    expect(img).toHaveAttribute('src', '/cases/ANVIL.webp')
  })

  it('renders item image for a known code', () => {
    renderWithProviders(<AssetImage kind="item" code="AK_REDLINE" alt="AK" />)

    expect(screen.getByRole('img', { name: 'AK' })).toHaveAttribute(
      'src',
      '/items/AK_REDLINE.webp',
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
    renderWithProviders(<AssetImage kind="item" code="AK_REDLINE" alt="Broken" />)

    const img = screen.getByRole('img', { name: 'Broken' })
    expect(img).toHaveAttribute('src', '/items/AK_REDLINE.webp')

    fireEvent.error(img)

    expect(img).toHaveAttribute('src', ITEM_FALLBACK_SRC)
  })
})
