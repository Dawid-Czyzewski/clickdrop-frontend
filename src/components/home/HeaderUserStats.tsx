import { CurrencyBadge } from '../ui/CurrencyBadge'
import { levelProgress } from '../../lib/levelProgress'

type HeaderUserStatsProps = {
  level: number
  experience: number
  balance: string | null
  levelLabel: string
  xpLabel: string
  xpProgressLabel: string
  balanceLabel: string
}

export function HeaderUserStats({
  level,
  experience,
  balance,
  levelLabel,
  xpLabel,
  xpProgressLabel,
  balanceLabel,
}: HeaderUserStatsProps) {
  const { currentXp, xpForLevel, ratio } = levelProgress(experience)
  const percent = Math.round(ratio * 100)

  return (
    <div className="flex min-w-0 items-center gap-2" aria-live="polite">
      <div
        className="flex items-center gap-1.5 rounded-md border border-cd-border bg-cd-surface px-2 py-1.5 text-xs sm:gap-2 sm:px-2.5"
        aria-label={`${levelLabel} ${level}, ${currentXp} / ${xpForLevel} ${xpLabel}`}
      >
        <span className="font-medium tracking-wider text-cd-muted uppercase">
          <span className="sm:hidden">Lv</span>
          <span className="hidden sm:inline">{levelLabel}</span>{' '}
          <span className="font-display font-semibold tabular-nums text-cd-text">{level}</span>
        </span>
        <div
          className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-cd-border sm:block sm:w-20"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={xpForLevel}
          aria-valuenow={currentXp}
          aria-label={xpProgressLabel}
        >
          <div
            className="h-full rounded-full bg-cd-accent transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="hidden font-display font-semibold tabular-nums text-cd-muted md:inline">
          {xpProgressLabel}
        </span>
      </div>
      {balance !== null ? (
        <div
          className="flex max-w-[4.75rem] items-center gap-1 overflow-hidden rounded-md border border-cd-accent/35 bg-cd-surface px-2 py-1.5 text-xs sm:max-w-[9rem] sm:gap-1.5 sm:px-2.5 md:max-w-none"
          aria-label={`${balanceLabel} ${balance}`}
        >
          <CurrencyBadge />
          <span className="truncate font-display font-semibold tabular-nums text-cd-accent">
            {balance}
          </span>
        </div>
      ) : null}
    </div>
  )
}

export function HeaderUserStatsLoading({ label }: { label: string }) {
  return (
    <p className="text-xs text-cd-muted" role="status" aria-live="polite">
      {label}
    </p>
  )
}
