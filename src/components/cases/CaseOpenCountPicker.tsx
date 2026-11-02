'use client'

import { useTranslation } from 'react-i18next'

export type CaseOpenCount = 1 | 5

type CaseOpenCountPickerProps = {
  value: CaseOpenCount
  disabled?: boolean
  onChange: (count: CaseOpenCount) => void
}

const OPTIONS: CaseOpenCount[] = [1, 5]

export function CaseOpenCountPicker({
  value,
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
      {OPTIONS.map((count) => {
        const selected = value === count
        return (
          <button
            key={count}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onChange(count)}
            className={[
              'h-11 min-w-[3.5rem] flex-1 cursor-pointer rounded-md border px-3 font-display text-sm font-semibold tracking-wide uppercase transition disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none',
              selected
                ? 'border-cd-accent bg-cd-accent text-cd-bg'
                : 'border-cd-border bg-cd-bg text-cd-muted hover:border-cd-accent/50 hover:text-cd-text',
            ].join(' ')}
          >
            {t(count === 1 ? 'cases.openCount.one' : 'cases.openCount.five')}
          </button>
        )
      })}
    </div>
  )
}
