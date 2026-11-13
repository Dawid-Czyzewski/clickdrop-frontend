import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InventoryItemCard } from '../../src/components/inventory/InventoryItemCard'
import { renderWithProviders } from '../utils/render'

const baseItem = {
  inventoryItemId: 9,
  itemId: 3,
  code: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  floatValue: 0.25,
  paintSeed: 123,
  suggestedSellPrice: 40,
  createdAt: '2026-01-01T00:00:00Z',
}

const cardProps = {
  selected: false,
  isSelling: false,
  disabled: false,
  onToggleSelect: () => {},
  onSell: () => {},
}

describe('InventoryItemCard StatTrack', () => {
  it('shows StatTrack badge when statTrack is true', () => {
    renderWithProviders(
      <InventoryItemCard item={{ ...baseItem, statTrack: true }} {...cardProps} />,
    )

    expect(screen.getByText('StatTrack')).toBeInTheDocument()
  })

  it('hides StatTrack badge when false or missing', () => {
    const { rerender } = renderWithProviders(
      <InventoryItemCard item={{ ...baseItem, statTrack: false }} {...cardProps} />,
    )

    expect(screen.queryByText('StatTrack')).not.toBeInTheDocument()

    rerender(<InventoryItemCard item={baseItem} {...cardProps} />)

    expect(screen.queryByText('StatTrack')).not.toBeInTheDocument()
  })
})
