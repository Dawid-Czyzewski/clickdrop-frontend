import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CaseOpenResultModal } from '../../src/components/cases/CaseOpenResultModal'
import { renderWithProviders } from '../utils/render'

const baseDrop = {
  inventoryItemId: 9,
  itemCode: 'AK_47_SLATE',
  itemDisplayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
}

const modalProps = {
  isSelling: false,
  onKeep: () => {},
  onSell: () => {},
  onClose: () => {},
}

describe('CaseOpenResultModal StatTrack', () => {
  it('shows StatTrack badge on the item when statTrack is true', () => {
    renderWithProviders(
      <CaseOpenResultModal drop={{ ...baseDrop, statTrack: true }} {...modalProps} />,
    )

    expect(screen.getByText('StatTrack')).toBeInTheDocument()
  })

  it('hides StatTrack badge when false or missing', () => {
    const { rerender } = renderWithProviders(
      <CaseOpenResultModal drop={{ ...baseDrop, statTrack: false }} {...modalProps} />,
    )

    expect(screen.queryByText('StatTrack')).not.toBeInTheDocument()

    rerender(<CaseOpenResultModal drop={baseDrop} {...modalProps} />)

    expect(screen.queryByText('StatTrack')).not.toBeInTheDocument()
  })
})
