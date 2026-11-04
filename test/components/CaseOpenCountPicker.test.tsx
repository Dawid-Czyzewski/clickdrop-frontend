import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CaseOpenCountPicker } from '../../src/components/cases/CaseOpenCountPicker'
import { renderWithProviders } from '../utils/render'

const gameCase = {
  openX3MinLevel: 5,
  openX5MinLevel: 10,
  maxOpenCount: 5,
}

describe('CaseOpenCountPicker', () => {
  it('locks ×3 and ×5 below required levels', () => {
    renderWithProviders(
      <CaseOpenCountPicker
        value={1}
        gameCase={gameCase}
        userLevel={1}
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /^×1$/i })).toBeEnabled()
    expect(
      screen.getByRole('button', { name: /×3, from lvl 5/i }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /×5, from lvl 10/i }),
    ).toBeDisabled()
    expect(screen.getByText('From Lvl 5')).toBeInTheDocument()
    expect(screen.getByText('From Lvl 10')).toBeInTheDocument()
  })

  it('unlocks ×3 at threshold while keeping ×5 locked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithProviders(
      <CaseOpenCountPicker
        value={1}
        gameCase={gameCase}
        userLevel={5}
        onChange={onChange}
      />,
    )

    const x3 = screen.getByRole('button', { name: /^×3$/i })
    expect(x3).toBeEnabled()
    expect(
      screen.getByRole('button', { name: /×5, from lvl 10/i }),
    ).toBeDisabled()

    await user.click(x3)
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('unlocks ×5 at threshold and ignores clicks on locked counts', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    const { rerender } = renderWithProviders(
      <CaseOpenCountPicker
        value={1}
        gameCase={gameCase}
        userLevel={4}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: /×5, from lvl 10/i }))
    expect(onChange).not.toHaveBeenCalled()

    rerender(
      <CaseOpenCountPicker
        value={1}
        gameCase={gameCase}
        userLevel={10}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: /^×5$/i }))
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
