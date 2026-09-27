import { CurrencyBadge } from '../ui/CurrencyBadge'

type HeaderStatProps = {
  label: string
  value: string
}

function HeaderStat({ label, value }: HeaderStatProps) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-md border border-cd-border bg-cd-surface px-2 py-1 text-xs sm:px-2.5"
      aria-label={`${label} ${value}`}
    >
      <span className="font-medium tracking-wider text-cd-muted uppercase">{label}</span>
      <span className="font-display font-semibold tabular-nums text-cd-text">{value}</span>
    </div>
  )
}

type HeaderUserStatsProps = {
  level: number
  experience: number
  balance: string | null
  levelLabel: string
  xpLabel: string
  balanceLabel: string
}

export function HeaderUserStats({
  level,
  experience,
  balance,
  levelLabel,
  xpLabel,
  balanceLabel,
}: HeaderUserStatsProps) {
  return (
    <div className="hidden items-center gap-1.5 md:flex" aria-live="polite">
      <HeaderStat label={levelLabel} value={String(level)} />
      <HeaderStat label={xpLabel} value={String(experience)} />
      {balance !== null ? (
        <div
          className="flex items-center gap-1.5 rounded-md border border-cd-accent/35 bg-cd-surface px-2 py-1 text-xs sm:px-2.5"
          aria-label={`${balanceLabel} ${balance}`}
        >
          <CurrencyBadge />
          <span className="font-display font-semibold tabular-nums text-cd-accent">{balance}</span>
        </div>
      ) : null}
    </div>
  )
}

export function HeaderUserStatsLoading({ label }: { label: string }) {
  return (
    <p className="hidden text-xs text-cd-muted md:block" role="status" aria-live="polite">
      {label}
    </p>
  )
}
