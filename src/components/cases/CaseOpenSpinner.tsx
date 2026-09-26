'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CaseDrop } from '../../api/casesApi'
import { itemNameKey, RARITY_COLOR, rarityLabelKey } from '../../lib/caseI18n'
import {
  buildSpinStrip,
  SPIN_DURATION_MS,
  SPIN_ITEM_WIDTH,
  SPIN_WINNER_INDEX,
  spinOffsetPx,
} from '../../lib/caseSpin'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { isCashSpinCode, parseCashSpinAmount } from '../../lib/dailySpin'
import { AssetImage } from '../media/AssetImage'

type CaseOpenSpinnerProps = {
  drops: CaseDrop[]
  winnerCode: string
  onComplete: () => void
}

export function CaseOpenSpinner({ drops, winnerCode, onComplete }: CaseOpenSpinnerProps) {
  const { t, i18n } = useTranslation()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [running, setRunning] = useState(false)
  const strip = useMemo(() => buildSpinStrip(drops, winnerCode), [drops, winnerCode])
  const completedRef = useRef(false)

  function finish() {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      finish()
      return
    }

    const viewportWidth = viewportRef.current?.clientWidth ?? 640
    const target = spinOffsetPx(SPIN_WINNER_INDEX, viewportWidth)
    const startId = window.requestAnimationFrame(() => {
      setRunning(true)
      setOffset(target)
    })
    const timer = window.setTimeout(finish, SPIN_DURATION_MS + 80)

    return () => {
      window.cancelAnimationFrame(startId)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-spin-title"
      aria-busy="true"
    >
      <div className="w-full max-w-4xl">
        <p
          id="case-spin-title"
          className="mb-4 text-center font-display text-sm tracking-[0.2em] text-cd-accent uppercase"
        >
          {t('cases.spinning')}
        </p>

        <div
          ref={viewportRef}
          className="relative overflow-hidden rounded-xl border border-cd-border bg-cd-bg py-4"
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-0.5 -translate-x-1/2 bg-cd-accent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-2 left-1/2 z-10 w-28 -translate-x-1/2 rounded-md border-2 border-cd-accent/80"
            aria-hidden="true"
          />

          <div
            className="flex will-change-transform"
            style={{
              gap: 0,
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: running
                ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.8, 0.08, 1)`
                : 'none',
            }}
          >
            {strip.map((drop, index) => {
              const cashAmount = parseCashSpinAmount(drop.code)
              const isCash = isCashSpinCode(drop.code)
              const color = isCash ? '#f59e0b' : (RARITY_COLOR[drop.rarity] ?? '#8b92a5')
              return (
                <div
                  key={`${drop.code}-${index}`}
                  className="flex shrink-0 flex-col items-center justify-center border-r border-cd-border/60 px-2"
                  style={{ width: SPIN_ITEM_WIDTH }}
                >
                  <div
                    className="flex h-20 w-24 items-center justify-center overflow-hidden rounded-md border p-1"
                    style={{
                      borderColor: color,
                      background: `radial-gradient(circle at 50% 40%, ${color}44, transparent 70%)`,
                    }}
                  >
                    {isCash ? (
                      <span className="font-display text-2xl font-bold" style={{ color }}>
                        $
                      </span>
                    ) : (
                      <AssetImage
                        kind="item"
                        code={drop.code}
                        alt={t(itemNameKey(drop.code))}
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                  <p
                    className="mt-2 max-w-full truncate text-center text-[0.65rem] font-medium uppercase"
                    style={{ color }}
                  >
                    {isCash ? t('daily.cashLabel') : t(rarityLabelKey(drop.rarity))}
                  </p>
                  <p className="max-w-full truncate text-center text-xs text-cd-text">
                    {isCash && cashAmount !== null
                      ? `${formatClickDollars(cashAmount, i18n.language)} CD`
                      : t(itemNameKey(drop.code))}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
