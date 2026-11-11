import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useModalA11y } from '../../src/hooks/useModalA11y'

function ModalHarness({ onClose }: { onClose: () => void }) {
  const dialogRef = useModalA11y({ onClose })
  return (
    <div ref={dialogRef} tabIndex={-1} role="dialog" aria-label="demo">
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

describe('useModalA11y', () => {
  it('focuses the first control and closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ModalHarness onClose={onClose} />)

    expect(screen.getByRole('button', { name: /^close$/i })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
