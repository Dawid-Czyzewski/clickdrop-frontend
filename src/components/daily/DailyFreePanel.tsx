'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isDailyCashClaim, isDailySkinClaim } from '../../api/dailyApi'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useDailyFree } from '../../hooks/useDailyFree'
import { dailyDropSpinCode, toSpinCaseDrop } from '../../lib/dailySpin'
import { formatCountdown } from '../../lib/formatCountdown'
import { CaseOpenResultModal } from '../cases/CaseOpenResultModal'
import { CaseOpenSpinner } from '../cases/CaseOpenSpinner'
import { AssetImage } from '../media/AssetImage'
import { DailyCashResultModal } from './DailyCashResultModal'
import { DailyDropsGrid } from './DailyDropsGrid'

export function DailyFreePanel() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const { applyBalance } = useBalance({ enabled: loggedIn })
  const {
    drops,
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
  } = useDailyFree({ loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  const spinPool = useMemo(() => drops.map(toSpinCaseDrop), [drops])
  const locked = Boolean(loggedIn && status && !status.available)
  const isOpening = isClaiming || spinning
  const openDisabled = !canClaim || spinning

  async function handleOpen() {
    const result = await claim()
    if (!result) return
    if (isDailyCashClaim(result)) applyBalance(result.balance)
    const skipSpin = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setSpinning(!skipSpin && spinPool.length > 0)
  }

  async function handleSell() {
    const next = await sellDrop()
    if (next !== null) applyBalance(next)
  }

  function handleKeep() {
    keepDrop()
    router.push('/inventory')
  }

  function winnerCode(): string {
    if (!drop) return ''
    if (isDailySkinClaim(drop)) return drop.itemCode
    return dailyDropSpinCode({ type: 'CASH', cashAmount: drop.cashAmount, weight: 1 })
  }

  if (isLoading) {
    return (
      <p role="status" className="py-16 text-center text-sm text-cd-muted">
        {t('daily.loading')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
          <div
            className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-cd-border bg-cd-bg/60 p-4"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.18), transparent 65%)',
            }}
          >
            <AssetImage
              kind="case"
              code="ANVIL"
              alt={t('daily.title')}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
            {t('daily.eyebrow')}
          </p>
          <h1 className="font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
            {t('daily.title')}
          </h1>
          <p className="text-cd-muted">
            {loggedIn ? t('daily.subtitle') : t('daily.guestSubtitle')}
          </p>

          {!loggedIn ? (
            <Link
              href="/login"
              className="w-full cursor-pointer rounded-md bg-cd-accent px-6 py-3.5 text-center font-display text-sm font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover"
            >
              {t('daily.loginCta')}
            </Link>
          ) : locked ? (
            <div className="flex w-full flex-col items-center gap-2">
              <p className="text-sm text-cd-muted">{t('daily.countdownHint')}</p>
              <p className="font-display text-3xl font-bold tabular-nums text-cd-accent">
                {formatCountdown(remainingMs)}
              </p>
            </div>
          ) : (
            <button
              type="button"
              disabled={openDisabled}
              aria-busy={isOpening || undefined}
              onClick={() => {
                void handleOpen()
              }}
              className="w-full cursor-pointer rounded-md bg-cd-accent px-6 py-3.5 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOpening ? t('daily.opening') : t('daily.open')}
            </button>
          )}

          {error ? (
            <p role="alert" className="text-sm text-cd-danger">
              {error}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-sm font-medium tracking-[0.2em] text-cd-muted uppercase">
            {t('daily.dropsHeading')}
          </h2>
          <p className="mt-1 mb-4 text-sm text-cd-muted">{t('daily.dropsSubtitle')}</p>
          <DailyDropsGrid drops={drops} />
        </div>
      </div>

      {spinning && drop ? (
        <CaseOpenSpinner
          drops={spinPool}
          winnerCode={winnerCode()}
          onComplete={() => setSpinning(false)}
        />
      ) : null}

      {!spinning && drop && isDailySkinClaim(drop) ? (
        <CaseOpenResultModal
          drop={drop}
          isSelling={isSelling}
          onKeep={handleKeep}
          onSell={() => {
            void handleSell()
          }}
        />
      ) : null}

      {!spinning && drop && isDailyCashClaim(drop) ? (
        <DailyCashResultModal
          cashAmount={drop.cashAmount}
          balance={drop.balance}
          onClose={keepDrop}
        />
      ) : null}
    </div>
  )
}
