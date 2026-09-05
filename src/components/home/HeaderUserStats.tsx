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
      <span className="font-medium uppercase tracking-wider text-cd-muted">{label}</span>
      <span className="font-display font-semibold text-cd-accent">{value}</span>
    </div>
  )
}

type HeaderUserStatsProps = {
  level: number
  experience: number
  levelLabel: string
  xpLabel: string
}

export function HeaderUserStats({ level, experience, levelLabel, xpLabel }: HeaderUserStatsProps) {
  return (
    <div className="hidden items-center gap-1.5 md:flex" aria-live="polite">
      <HeaderStat label={levelLabel} value={String(level)} />
      <HeaderStat label={xpLabel} value={String(experience)} />
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
