'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useDailyFree } from '../../hooks/useDailyFree'
import { formatCountdown } from '../../lib/formatCountdown'
import { CasePlaceholder } from '../home/CasePlaceholder'
import { CaseOpenResultModal } from '../cases/CaseOpenResultModal'

export function DailyFreePanel() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const { applyBalance } = useBalance({ enabled: loggedIn })
  const {
    status,
    drop,
    isLoading,
    isClaiming,
    isSelling,
    error,
    remainingMs,
    canClaim,
    claim,
    sellDrop,
    keepDrop,
  } = useDailyFree({ enabled: loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  async function handleSell() {
    const balance = await sellDrop()
    if (balance !== null) applyBalance(balance)
  }

  function handleKeep() {
    keepDrop()
    router.push('/inventory')
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-cd-border bg-cd-bg/60">
          <CasePlaceholder accent="#f59e0b" className="h-[70%] w-[70%]" />
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
            {t('daily.eyebrow')}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
            {t('daily.title')}
          </h1>
          <p className="mt-2 max-w-md text-cd-muted">{t('daily.guestSubtitle')}</p>
        </div>
        <Link
          href="/login"
          className="cursor-pointer rounded-md bg-cd-accent px-8 py-3.5 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover"
        >
          {t('daily.loginCta')}
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <p role="status" className="py-16 text-center text-sm text-cd-muted">
        {t('daily.loading')}
      </p>
    )
  }

  const locked = Boolean(status && !status.available)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 py-6 text-center sm:py-10">
      <div>
        <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
          {t('daily.eyebrow')}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
          {t('daily.title')}
        </h1>
        <p className="mt-2 text-cd-muted">{t('daily.subtitle')}</p>
      </div>

      <div
        className="flex aspect-square w-full max-w-sm items-center justify-center rounded-xl border border-cd-border bg-cd-bg/60"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.18), transparent 65%)',
        }}
      >
        <CasePlaceholder accent="#f59e0b" className="h-[70%] w-[70%]" />
      </div>

      {locked ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-cd-muted">{t('daily.countdownHint')}</p>
          <p className="font-display text-3xl font-bold tabular-nums text-cd-accent">
            {formatCountdown(remainingMs)}
          </p>
        </div>
      ) : (
        <button
          type="button"
          disabled={!canClaim}
          aria-busy={isClaiming || undefined}
          onClick={() => {
            void claim()
          }}
          className="w-full max-w-sm cursor-pointer rounded-md bg-cd-accent px-6 py-3.5 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isClaiming ? t('daily.claiming') : t('daily.claim')}
        </button>
      )}

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {drop ? (
        <CaseOpenResultModal
          drop={drop}
          isSelling={isSelling}
          onKeep={handleKeep}
          onSell={() => {
            void handleSell()
          }}
        />
      ) : null}
    </div>
  )
}
