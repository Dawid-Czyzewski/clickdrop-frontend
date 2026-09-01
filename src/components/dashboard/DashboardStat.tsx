type DashboardStatProps = {
  label: string
  value: string
}

export function DashboardStat({ label, value }: DashboardStatProps) {
  return (
    <div className="rounded-lg border border-cd-border bg-cd-surface px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-cd-muted">{label}</dt>
      <dd className="mt-1 font-display text-xl font-semibold text-cd-text">{value}</dd>
    </div>
  )
}
