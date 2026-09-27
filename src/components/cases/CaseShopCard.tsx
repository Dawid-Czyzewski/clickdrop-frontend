'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { GameCase } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { CASE_ACCENT, caseNameKey } from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { CurrencyBadge } from '../ui/CurrencyBadge'
import { cdTile } from '../ui/uiStyles'

type CaseShopCardProps = {
  gameCase: GameCase
}

export function CaseShopCard({ gameCase }: CaseShopCardProps) {
  const { t, i18n } = useTranslation()
  const accent = CASE_ACCENT[gameCase.code] ?? '#f59e0b'
  const name = t(caseNameKey(gameCase.code))

  return (
    <Link
      href={`/cases/${gameCase.id}`}
      className={`group flex cursor-pointer flex-col overflow-hidden no-underline ${cdTile}`}
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-cd-bg/40 p-3 sm:aspect-square sm:p-4"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${accent}30, transparent 68%)`,
        }}
      >
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
