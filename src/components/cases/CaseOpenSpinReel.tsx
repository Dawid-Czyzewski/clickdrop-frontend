'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CaseDrop } from '../../api/casesApi'
import { RARITY_COLOR, rarityLabelKey, resolveItemLabel } from '../../lib/caseI18n'
import { isRareSpecialItem, RARE_SPECIAL_COLOR } from '../../lib/rareSpecial'
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

type CaseOpenSpinReelProps = {
  drops: CaseDrop[]
  winnerCode: string
  delayMs?: number
  itemWidth?: number
  durationMs?: number
  compact?: boolean
  onComplete?: () => void
}

export function CaseOpenSpinReel({
  drops,
  winnerCode,
  delayMs = 0,
  itemWidth = SPIN_ITEM_WIDTH,
  durationMs = SPIN_DURATION_MS,
  compact = false,
  onComplete,
}: CaseOpenSpinReelProps) {
  const { t, i18n } = useTranslation()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [running, setRunning] = useState(false)
  const strip = useMemo(() => buildSpinStrip(drops, winnerCode), [drops, winnerCode])
  const completedRef = useRef(false)

  function finish() {
    if (!onComplete || completedRef.current) return
    completedRef.current = true
    onComplete()
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      finish()
      return
    }

    let startId = 0
    let timer = 0
    const delayId = window.setTimeout(() => {
      const viewportWidth = viewportRef.current?.clientWidth ?? 640
      const target = spinOffsetPx(SPIN_WINNER_INDEX, viewportWidth, itemWidth)
      startId = window.requestAnimationFrame(() => {
        setRunning(true)
        setOffset(target)
      })
      timer = window.setTimeout(finish, durationMs + 80)
    }, delayMs)

    return () => {
      window.clearTimeout(delayId)
      window.cancelAnimationFrame(startId)
      window.clearTimeout(timer)
    }
  }, [delayMs, durationMs, itemWidth])

  const cardH = compact ? 'h-16 w-20 sm:h-20 sm:w-24' : 'h-28 w-36 sm:h-32 sm:w-40'
  const padY = compact ? 'py-2.5 sm:py-3' : 'py-6 sm:py-8'

  return (
    <div
      ref={viewportRef}
      className={`relative overflow-hidden rounded-xl border border-cd-border bg-cd-bg ${padY}`}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-0.5 -translate-x-1/2 bg-cd-accent"
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-lg border-2 border-cd-accent/80 ${
          compact ? 'inset-y-1.5 w-24 sm:w-28' : 'inset-y-3 w-40 sm:inset-y-4 sm:w-44'
        }`}
        aria-hidden="true"
      />

      <div
        className="flex will-change-transform"
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
          transition: running
            ? `transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.08, 1)`
            : 'none',
        }}
      >
        {strip.map((drop, index) => {
          const cashAmount = parseCashSpinAmount(drop.code)
          const isCash = isCashSpinCode(drop.code)
          const isRare = !isCash && isRareSpecialItem(drop.code, drop.displayName)
          const color = isCash
            ? '#f59e0b'
            : isRare
              ? RARE_SPECIAL_COLOR
              : (RARITY_COLOR[drop.rarity] ?? '#8b92a5')
          return (
            <div
              key={`${drop.code}-${index}`}
              className="flex shrink-0 flex-col items-center justify-center border-r border-cd-border/60 px-1.5"
              style={{ width: itemWidth }}
            >
              <div
                className={`flex items-center justify-center overflow-hidden rounded-lg border p-1 ${cardH}`}
                style={{
                  borderColor: color,
                  background: `radial-gradient(circle at 50% 40%, ${color}44, transparent 70%)`,
                }}
              >
                {isCash ? (
                  <span
                    className={`font-display font-bold ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}
                    style={{ color }}
                  >
                    $
                  </span>
                ) : (
                  <AssetImage
                    kind="item"
                    code={isRare ? 'RARE_SPECIAL' : drop.code}
                    alt={
                      isRare
                        ? t('cases.rareSpecialName')
                        : resolveItemLabel(t, drop.code, drop.displayName)
                    }
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              {!compact ? (
                <>
                  <p
                    className="mt-2.5 max-w-full truncate text-center text-xs font-medium uppercase"
                    style={{ color }}
                  >
                    {isCash
                      ? t('daily.cashLabel')
                      : isRare
                        ? t('cases.rareSpecialRarity')
                        : t(rarityLabelKey(drop.rarity))}
                  </p>
                  <p className="max-w-full truncate text-center text-sm text-cd-text">
                    {isCash && cashAmount !== null
                      ? `${formatClickDollars(cashAmount, i18n.language)} CD`
                      : isRare
                        ? t('cases.rareSpecialName')
                        : resolveItemLabel(t, drop.code, drop.displayName)}
                  </p>
                </>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
