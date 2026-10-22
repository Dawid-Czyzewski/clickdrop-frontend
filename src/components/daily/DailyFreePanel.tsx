'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isDailyCashClaim, isDailySkinClaim } from '../../api/dailyApi'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useDailyFree } from '../../hooks/useDailyFree'
import { shouldSkipCaseSpin } from '../../lib/caseAnimationPreference'
import { dailyDropSpinCode, toSpinCaseDrop } from '../../lib/dailySpin'
import { formatCountdown } from '../../lib/formatCountdown'
import { CaseOpenResultModal } from '../cases/CaseOpenResultModal'
import { CaseOpenSpinner } from '../cases/CaseOpenSpinner'
import { SkipCaseAnimationToggle } from '../cases/SkipCaseAnimationToggle'
import { AssetImage } from '../media/AssetImage'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryBlock,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdHeroFrame,
  cdPageTitle,
  cdSectionLabel,
} from '../ui/uiStyles'
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
    setSpinning(!shouldSkipCaseSpin() && spinPool.length > 0)
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
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full max-w-md">
            <CatalogSkeleton count={1} colsClassName="grid-cols-1" />
          </div>
          <CatalogSkeleton count={4} colsClassName="grid-cols-2 sm:grid-cols-3" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
          <div
            className={cdHeroFrame}
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.16), transparent 65%)',
            }}
          >
            <AssetImage
              kind="case"
              code="REVOLUTION_CASE"
              alt={t('daily.title')}
              className="h-full w-full object-contain"
            />
          </div>
          <p className={cdEyebrow}>{t('daily.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('daily.title')}</h1>
          <p className={cdBodyMuted}>
            {loggedIn ? t('daily.subtitle') : t('daily.guestSubtitle')}
          </p>

          {!loggedIn ? (
            <Link href="/login" className={`${cdBtnPrimaryLink} w-full`}>
              {t('daily.loginCta')}
            </Link>
          ) : locked ? (
            <div className="flex w-full flex-col items-center gap-3">
              <p className={cdBodyMuted}>{t('daily.countdownHint')}</p>
              <p className="font-display text-3xl font-bold tabular-nums text-cd-accent">
                {formatCountdown(remainingMs)}
              </p>
              <Link href="/#cases" className={`${cdBtnPrimaryLink} w-full`}>
                {t('daily.lockedCta')}
              </Link>
              <SkipCaseAnimationToggle />
            </div>
          ) : (
            <>
              <SkipCaseAnimationToggle disabled={isOpening} />
              <button
                type="button"
                disabled={openDisabled}
                aria-busy={isOpening || undefined}
                onClick={() => {
                  void handleOpen()
                }}
                className={cdBtnPrimaryBlock}
              >
                {isOpening ? t('daily.opening') : t('daily.open')}
              </button>
            </>
          )}

          {error ? (
            <p role="alert" className="text-sm text-cd-danger">
              {error}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className={cdSectionLabel}>{t('daily.dropsHeading')}</h2>
          <p className={`mt-1 mb-4 ${cdBodyMuted}`}>{t('daily.dropsSubtitle')}</p>
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
          onClose={keepDrop}
          onKeep={handleKeep}
          onSell={() => {
            void handleSell()
          }}
          backdropCodes={drops
            .filter((d) => d.type === 'SKIN')
            .map((d) => d.itemCode)}
        />
      ) : null}

      {!spinning && drop && isDailyCashClaim(drop) ? (
        <DailyCashResultModal cashAmount={drop.cashAmount} onClose={keepDrop} />
      ) : null}
    </div>
  )
}
