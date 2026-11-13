import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InventoryInspectModal } from '../../src/components/inventory/InventoryInspectModal'
import { renderWithProviders } from '../utils/render'

const item = {
  inventoryItemId: 9,
  itemId: 3,
  code: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  floatValue: 0.250137,
  paintSeed: 421,
  suggestedSellPrice: 40,
  createdAt: '2026-01-01T00:00:00Z',
}

describe('InventoryInspectModal', () => {
  it('shows Float and Pattern from mock inventory item', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    renderWithProviders(
      <InventoryInspectModal
        item={item}
        isSelling={false}
        onClose={onClose}
        onSell={() => {}}
      />,
    )

    expect(screen.getByRole('dialog', { name: /AK-47 \| Slate/i })).toBeInTheDocument()
    expect(screen.getByText('Float')).toBeInTheDocument()
    expect(screen.getByText('0.250137')).toBeInTheDocument()
    expect(screen.getByText('Pattern')).toBeInTheDocument()
    expect(screen.getByText('421')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
