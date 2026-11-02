'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { ClickButton } from './ClickButton'

export function GuestEarnPreview() {
  const { t } = useTranslation()

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-7 overflow-x-clip">
      <div className="relative max-w-full overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-cd-accent/10 blur-2xl" aria-hidden="true" />
        <div className="relative opacity-90">
          <ClickButton disabled />
        </div>
        <p className="pointer-events-none absolute -top-1 left-1/2 z-20 -translate-x-1/2 font-display text-sm font-bold tracking-wide text-[#7dffa0] drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)] sm:text-base">
          {t('home.earn.guestPerClick')}
        </p>
      </div>

      <ul className="m-0 grid w-full list-none gap-3 sm:grid-cols-3">
        {(
          [
            { key: 'click', href: '/login' },
            { key: 'upgrade', href: '/upgrades' },
            { key: 'cases', href: '#cases' },
          ] as const
        ).map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="flex h-full flex-col gap-1 rounded-md border border-cd-border/80 bg-cd-bg/50 px-4 py-3 text-left no-underline transition hover:border-cd-accent/40 hover:bg-cd-bg/80"
            >
              <span className="font-display text-[0.65rem] tracking-[0.18em] text-cd-accent uppercase">
                {t(`home.earn.guestSteps.${item.key}.label`)}
              </span>
              <span className="text-sm font-medium text-cd-text">
                {t(`home.earn.guestSteps.${item.key}.title`)}
              </span>
              <span className="text-xs text-cd-muted">
                {t(`home.earn.guestSteps.${item.key}.text`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-3">
        <Link
          href="/login"
          className="inline-flex h-12 w-full max-w-sm cursor-pointer items-center justify-center rounded-md bg-cd-accent px-6 text-center font-display text-sm font-semibold tracking-wider text-cd-bg uppercase no-underline shadow-[0_8px_24px_rgba(245,158,11,0.25)] transition hover:bg-cd-accent-hover"
        >
          {t('home.earn.loginCta')}
        </Link>
        <p className="max-w-sm text-sm text-cd-muted">{t('home.earn.guestHint')}</p>
      </div>
    </div>
  )
}
