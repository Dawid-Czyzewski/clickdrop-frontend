import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ClickButton } from '../../src/components/home/ClickButton'
import { renderWithProviders } from '../utils/render'

describe('ClickButton', () => {
  it('renders CLICK TO EARN label and dollar badge', () => {
    renderWithProviders(<ClickButton />)

    const button = screen.getByRole('button', { name: /click to earn/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('CLICK TO EARN')
    expect(button).toHaveTextContent('$')
  })

  it('applies pressed class on pointer down without calling API', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClickButton />)

    const button = screen.getByRole('button', { name: /click to earn/i })
    await user.pointer({ keys: '[MouseLeft>]', target: button })

    expect(button.className).toContain('cd-click-btn-pressed')
  })

  it('can be disabled', () => {
    renderWithProviders(<ClickButton disabled />)

    expect(screen.getByRole('button', { name: /click to earn/i })).toBeDisabled()
  })

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderWithProviders(<ClickButton onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: /click to earn/i }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderWithProviders(<ClickButton disabled onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: /click to earn/i }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
