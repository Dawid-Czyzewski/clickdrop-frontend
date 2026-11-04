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
      className="flex w-full items-center justify-center gap-2"
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
              'flex h-11 min-w-[3.5rem] flex-1 cursor-pointer flex-col items-center justify-center rounded-md border px-2 font-display text-sm font-semibold tracking-wide uppercase transition disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:min-w-[4.25rem]',
              selected && !locked
                ? 'border-cd-accent bg-cd-accent text-cd-bg'
                : 'border-cd-border bg-cd-bg text-cd-muted hover:border-cd-accent/50 hover:text-cd-text',
              locked ? 'opacity-50' : '',
            ].join(' ')}
          >
            <span>{label}</span>
            {lockHint ? (
              <span className="mt-0.5 text-[0.6rem] font-medium normal-case tracking-normal text-cd-danger">
                {lockHint}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
