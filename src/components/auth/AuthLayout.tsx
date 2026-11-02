'use client'

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '../../i18n/setAppLanguage'
import { ClickDropLogo } from './ClickDropLogo'

type AuthLayoutProps = {
  title: string
  children: ReactNode
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
  const { t, i18n } = useTranslation()

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-x-clip px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-cd-bg" aria-hidden="true" />
      <div
        className="cd-glow pointer-events-none absolute -top-1/4 left-1/2 h-[60vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-cd-accent/15 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute top-4 right-4 z-10 flex gap-2 sm:top-6 sm:right-6"
        role="group"
        aria-label={t('language.label')}
      >
        <button
          type="button"
          onClick={() => void setAppLanguage('pl')}
          className={`inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium transition ${
            i18n.language.startsWith('pl')
              ? 'bg-cd-accent text-cd-bg'
              : 'bg-cd-surface text-cd-muted ring-1 ring-cd-border hover:bg-cd-surface-hover hover:text-cd-text'
          }`}
        >
          {t('language.pl')}
        </button>
        <button
          type="button"
          onClick={() => void setAppLanguage('en')}
          className={`inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium transition ${
            i18n.language.startsWith('en')
              ? 'bg-cd-accent text-cd-bg'
              : 'bg-cd-surface text-cd-muted ring-1 ring-cd-border hover:bg-cd-surface-hover hover:text-cd-text'
          }`}
        >
          {t('language.en')}
        </button>
      </div>

      <div className="cd-fade-in relative z-10 w-full max-w-[420px]">
        <div className="rounded-lg border border-cd-border bg-cd-surface/90 px-6 py-8 shadow-[0_0_40px_rgba(245,158,11,0.08)] backdrop-blur-sm sm:px-8 sm:py-10">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <ClickDropLogo />
            <h1 className="font-display text-lg font-medium tracking-wide text-cd-muted sm:text-xl">
              {title}
            </h1>
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}
