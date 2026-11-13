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
  floatValue: 0.250137,
  paintSeed: 421,
  suggestedSellPrice: 40,
}

const modalProps = {
  isSelling: false,
  onKeep: () => {},
  onSell: () => {},
  onClose: () => {},
}

describe('CaseOpenResultModal', () => {
  it('renders Float and Pattern from mock drop', () => {
    renderWithProviders(<CaseOpenResultModal drop={baseDrop} {...modalProps} />)

    expect(screen.getByText('Float')).toBeInTheDocument()
    expect(screen.getByText('0.250137')).toBeInTheDocument()
    expect(screen.getByText('Pattern')).toBeInTheDocument()
    expect(screen.getByText('421')).toBeInTheDocument()
  })

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
