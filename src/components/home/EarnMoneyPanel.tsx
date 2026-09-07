'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useUpgrades } from '../../hooks/useUpgrades'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { totalClickReward } from '../../lib/clickReward'
import { ClickButton } from './ClickButton'
import { EarnedFeedback, type EarnToast } from './EarnedFeedback'
import { OwnedUpgradesFlank } from './OwnedUpgradesFlank'

export function EarnMoneyPanel() {
  const { t, i18n } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const [earnToasts, setEarnToasts] = useState<EarnToast[]>([])
  const [earnPulseKey, setEarnPulseKey] = useState(0)
  const nextToastId = useRef(0)
  const { balance, isLoading, isClicking, error, clickToEarn } = useBalance({
    enabled: loggedIn,
  })
  const { upgrades } = useUpgrades({ enabled: loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  const formattedBalance =
    balance === null ? null : formatClickDollars(balance, i18n.language)
  const clickReward = totalClickReward(upgrades)

  async function handleClick() {
    const result = await clickToEarn()
    if (!result) return

    const id = nextToastId.current + 1
    nextToastId.current = id

    setEarnToasts((prev) => [
      ...prev,
      { id, amount: result.earned, drift: ((id * 17) % 5) * 16 - 32 },
    ])
    setEarnPulseKey((key) => key + 1)
  }

  return (
    <section
      className="cd-fade-in relative overflow-hidden rounded-lg border border-cd-border bg-cd-surface/60"
      aria-labelledby="earn-panel-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, rgba(245,158,11,0.16), transparent 52%), linear-gradient(160deg, #12141c 0%, #0a0b0f 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-5 py-8 text-center sm:px-8 sm:py-10">
        <div className="flex flex-col items-center gap-2">
          <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
            {t('home.earn.eyebrow')}
          </p>
          <h1 id="earn-panel-title" className="font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
            {t('home.earn.title')}
          </h1>
          <p className="max-w-md text-base text-cd-muted">{t('home.earn.subtitle')}</p>
        </div>

        <div className="flex min-h-[3rem] flex-col items-center justify-center gap-1" aria-live="polite">
          {isLoading ? (
            <p role="status" className="text-sm text-cd-muted">
              {t('home.earn.loadingBalance')}
            </p>
          ) : null}

          {!isLoading && (formattedBalance !== null || !loggedIn) ? (
            <div className="flex flex-col items-center gap-1">
              <p
                key={`balance-${balance ?? 'guest'}-${earnPulseKey}`}
                className={[
                  'font-display text-2xl font-semibold tabular-nums text-cd-accent sm:text-3xl',
                  earnPulseKey > 0 ? 'cd-balance-bump' : '',
                ].join(' ')}
              >
                {loggedIn && formattedBalance !== null
                  ? t('home.earn.balanceValue', { amount: formattedBalance })
                  : t('home.earn.guestBalance')}
              </p>
              {loggedIn ? (
                <p className="font-display text-sm font-semibold tabular-nums text-[#7dffa0]">
                  {t('home.earn.perClick', { amount: clickReward })}
                </p>
              ) : null}
            </div>
          ) : null}

          {!isLoading && error ? (
            <p role="alert" className="text-sm text-cd-danger">
              {error}
            </p>
          ) : null}
        </div>

        {loggedIn ? (
          <div className="relative flex w-full max-w-4xl items-center justify-center gap-3 sm:gap-6">
            <OwnedUpgradesFlank upgrades={upgrades} side="left" />
            <div className="relative flex shrink-0 items-center justify-center">
              <ClickButton
                disabled={isLoading || isClicking}
                onClick={() => {
                  void handleClick()
                }}
              />
              <EarnedFeedback
                toasts={earnToasts}
                onDismiss={(id) => {
                  setEarnToasts((prev) => prev.filter((toast) => toast.id !== id))
                }}
              />
            </div>
            <OwnedUpgradesFlank upgrades={upgrades} side="right" />
          </div>
        ) : (
          <Link
            href="/login"
            className="cursor-pointer rounded-md bg-cd-accent px-6 py-3 text-center font-display text-sm font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover"
          >
            {t('home.earn.loginCta')}
          </Link>
        )}
      </div>
    </section>
  )
}
