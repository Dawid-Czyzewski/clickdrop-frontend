'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { GameCase } from '../../api/casesApi'
import { caseAccent, resolveCaseLabel } from '../../lib/caseI18n'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { AssetImage } from '../media/AssetImage'
import {
  cdBtnPrimaryBlock,
  cdBtnPrimaryLink,
  cdHeroFrame,
  cdMoney,
  cdPageTitle,
} from '../ui/uiStyles'
import { CaseOpenCountPicker, type CaseOpenCount } from './CaseOpenCountPicker'
import { SkipCaseAnimationToggle } from './SkipCaseAnimationToggle'

type CaseOpenHeroProps = {
  gameCase: GameCase
  loggedIn: boolean
  openCount: CaseOpenCount
  totalCost: number
  canAfford: boolean
  balance: number | null
  isOpening: boolean
  openDisabled: boolean
  resultOpen: boolean
  error: string
  onCountChange: (count: CaseOpenCount) => void
  onOpen: () => void
}

export function CaseOpenHero({
  gameCase,
  loggedIn,
  openCount,
  totalCost,
  canAfford,
  balance,
  isOpening,
  openDisabled,
  resultOpen,
  error,
  onCountChange,
  onOpen,
}: CaseOpenHeroProps) {
  const { t, i18n } = useTranslation()
  const accent = caseAccent(gameCase.code)
  const caseLabel = resolveCaseLabel(t, gameCase.code, gameCase.displayName)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div
        className={cdHeroFrame}
        style={{
          background: `radial-gradient(circle at 50% 40%, ${accent}20, transparent 65%)`,
        }}
      >
        <AssetImage
          kind="case"
          code={gameCase.code}
          alt={caseLabel}
          className="h-full w-full object-contain"
        />
      </div>
      <h1 className={`${cdPageTitle} text-center`}>{caseLabel}</h1>
      <p className={cdMoney}>
        {formatClickDollars(totalCost, i18n.language)} CD
        {openCount > 1 ? (
          <span className="ml-2 text-sm font-normal text-cd-muted">
            ({formatClickDollars(gameCase.price, i18n.language)} × {openCount})
          </span>
        ) : null}
      </p>

      {loggedIn ? (
        <>
          <CaseOpenCountPicker
            value={openCount}
            disabled={isOpening || resultOpen}
            onChange={onCountChange}
          />
          <SkipCaseAnimationToggle disabled={isOpening || resultOpen} />
          <button
            type="button"
            disabled={openDisabled}
            aria-busy={isOpening || undefined}
            onClick={onOpen}
            className={cdBtnPrimaryBlock}
          >
            {isOpening
              ? t('cases.openCount.opening', { count: openCount })
              : t('cases.openCount.open', { count: openCount })}
          </button>
        </>
      ) : (
        <Link href="/login" className={`${cdBtnPrimaryLink} w-full`}>
          {t('cases.loginCta')}
        </Link>
      )}

      {!canAfford && loggedIn && balance !== null && !resultOpen ? (
        <p className="text-sm text-cd-danger">
          {t('cases.openCount.insufficientFunds', {
            count: openCount,
            amount: formatClickDollars(totalCost, i18n.language),
          })}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
