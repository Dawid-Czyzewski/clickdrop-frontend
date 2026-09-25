export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

export function msUntil(isoDate: string | null | undefined, now = Date.now()): number {
  if (!isoDate) return 0
  const target = new Date(isoDate).getTime()
  if (Number.isNaN(target)) return 0
  return Math.max(0, target - now)
}
