'use client'

import { useTranslation } from 'react-i18next'
import type { GameCase } from '../../api/casesApi'
import {
  CASE_OPEN_COUNT_OPTIONS,
  isOpenCountLocked,
  requiredLevelForOpenCount,
  type CaseOpenCount,
} from '../../lib/caseOpenCount'

export type { CaseOpenCount }

type CaseOpenCountPickerProps = {
  value: CaseOpenCount
  gameCase: Pick<GameCase, 'openX3MinLevel' | 'openX5MinLevel' | 'maxOpenCount'>
  userLevel: number | null | undefined
  disabled?: boolean
  onChange: (count: CaseOpenCount) => void
}

const LABEL_KEY: Record<CaseOpenCount, string> = {
  1: 'cases.openCount.one',
  3: 'cases.openCount.three',
  5: 'cases.openCount.five',
}

export function CaseOpenCountPicker({
  value,
  gameCase,
  userLevel,
  disabled = false,
  onChange,
}: CaseOpenCountPickerProps) {
  const { t } = useTranslation()

  return (
    <div
      className="flex w-full min-w-0 items-stretch justify-center gap-2"
      role="group"
      aria-label={t('cases.openCount.label')}
    >
      {CASE_OPEN_COUNT_OPTIONS.map((count) => {
        const selected = value === count
        const locked = isOpenCountLocked(gameCase, count, userLevel)
        const requiredLevel = requiredLevelForOpenCount(gameCase, count)
        const label = t(LABEL_KEY[count])
        const lockHint = locked
          ? t('cases.openCount.fromLevel', { level: requiredLevel })
          : null

        return (
          <button
            key={count}
            type="button"
            disabled={disabled || locked}
            aria-pressed={selected}
            aria-label={lockHint ? `${label}, ${lockHint}` : label}
            title={lockHint ?? undefined}
            onClick={() => onChange(count)}
            className={[
              'flex min-h-11 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-md border px-1.5 py-1.5 font-display text-sm font-semibold tracking-wide uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-accent disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[4.25rem] sm:flex-none sm:px-3',
              selected && !locked
                ? 'border-cd-accent bg-cd-accent text-cd-bg'
                : 'border-cd-border bg-cd-bg text-cd-muted hover:border-cd-accent/50 hover:text-cd-text',
              locked ? 'opacity-50' : '',
            ].join(' ')}
          >
            <span>{label}</span>
            {lockHint ? (
              <span className="mt-0.5 max-w-full truncate text-[0.6rem] leading-tight font-medium normal-case tracking-normal text-cd-danger">
                {lockHint}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
