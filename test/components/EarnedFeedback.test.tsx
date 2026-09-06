import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import { EarnedFeedback } from '../../src/components/home/EarnedFeedback'
import i18n from '../utils/i18n'

describe('EarnedFeedback', () => {
  it('renders nothing when there are no toasts', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <EarnedFeedback toasts={[]} onDismiss={vi.fn()} />
      </I18nextProvider>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('keeps every toast visible instead of replacing the previous one', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <EarnedFeedback
          toasts={[
            { id: 1, amount: 1, drift: -16 },
            { id: 2, amount: 1, drift: 0 },
          ]}
          onDismiss={vi.fn()}
        />
      </I18nextProvider>,
    )

    expect(screen.getAllByText('+1 ClickDollar')).toHaveLength(3)
    expect(screen.getByRole('status')).toHaveTextContent('+1 ClickDollar')
  })
})
