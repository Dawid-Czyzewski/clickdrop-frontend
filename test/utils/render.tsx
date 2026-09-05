import { render, type RenderOptions } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import type { ReactElement, ReactNode } from 'react'
import i18n from './i18n'

type Options = Omit<RenderOptions, 'wrapper'>

export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}
