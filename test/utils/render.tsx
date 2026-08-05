import { render, type RenderOptions } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import type { ReactElement, ReactNode } from 'react'
import i18n from './i18n'

type Options = Omit<RenderOptions, 'wrapper'> & {
  routerProps?: MemoryRouterProps
}

export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const { routerProps, ...renderOptions } = options

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <I18nextProvider i18n={i18n}>
        <MemoryRouter {...routerProps}>{children}</MemoryRouter>
      </I18nextProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}
