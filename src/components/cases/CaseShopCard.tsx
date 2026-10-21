'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { GameCase } from '../../api/casesApi'
import { caseAccent, resolveCaseLabel } from '../../lib/caseI18n'
import { caseMinLevel, isCaseLevelLocked } from '../../lib/caseLevel'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { AssetImage } from '../media/AssetImage'
import { CurrencyBadge } from '../ui/CurrencyBadge'
import { cdTile } from '../ui/uiStyles'
import { CaseLevelBadge } from './CaseLevelBadge'

type CaseShopCardProps = {
  gameCase: GameCase
  userLevel?: number | null
}

export function CaseShopCard({ gameCase, userLevel = null }: CaseShopCardProps) {
  const { t, i18n } = useTranslation()
  const accent = caseAccent(gameCase.code)
  const name = resolveCaseLabel(t, gameCase.code, gameCase.displayName)
  const minLevel = caseMinLevel(gameCase)
  const locked = userLevel != null && isCaseLevelLocked(gameCase, userLevel)

  return (
    <Link
      href={`/cases/${gameCase.id}`}
      className={`group flex cursor-pointer flex-col overflow-hidden no-underline ${cdTile} ${
        locked ? 'opacity-80' : ''
      }`}
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-cd-bg/40 p-3 sm:aspect-square sm:p-4"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${accent}30, transparent 68%)`,
        }}
      >
        <CaseLevelBadge
          minLevel={minLevel}
          locked={locked}
          className="absolute top-2 right-2 z-10"
        />
        <AssetImage
          kind="case"
          code={gameCase.code}
          alt={name}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-col items-center gap-1.5 border-t border-cd-border/60 px-2.5 py-2.5">
        <h3 className="w-full truncate text-center text-sm font-medium text-cd-text">{name}</h3>
        <p className="flex items-center gap-1.5 font-display text-sm font-semibold tabular-nums text-cd-accent">
          <CurrencyBadge />
          {formatClickDollars(gameCase.price, i18n.language)}
        </p>
      </div>
    </Link>
  )
}
