'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { GameCase } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { CASE_ACCENT, caseNameKey } from '../../lib/caseI18n'
import { CasePlaceholder } from '../home/CasePlaceholder'

type CaseShopCardProps = {
  gameCase: GameCase
}

export function CaseShopCard({ gameCase }: CaseShopCardProps) {
  const { t, i18n } = useTranslation()
  const accent = CASE_ACCENT[gameCase.code] ?? '#f59e0b'

  return (
    <Link
      href={`/cases/${gameCase.id}`}
      className="group flex cursor-pointer flex-col rounded-lg border border-cd-border bg-cd-surface/70 p-3 no-underline transition hover:border-cd-accent/50 hover:bg-cd-surface"
    >
      <div className="relative flex aspect-[5/4] items-center justify-center rounded-md bg-cd-bg/60">
        <CasePlaceholder
          accent={accent}
          className="h-[72%] w-[72%] transition duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 truncate text-center text-sm font-medium text-cd-text">
        {t(caseNameKey(gameCase.code))}
      </h3>
      <p className="mt-1 text-center text-xs tabular-nums text-cd-muted">
        {formatClickDollars(gameCase.price, i18n.language)} CD
      </p>
      <span className="mt-2 rounded-md bg-cd-accent/90 px-3 py-2 text-center font-display text-xs font-semibold tracking-wide text-cd-bg uppercase transition group-hover:bg-cd-accent">
        {t('cases.view')}
      </span>
    </Link>
  )
}
