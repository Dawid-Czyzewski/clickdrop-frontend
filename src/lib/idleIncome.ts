import type { MyUpgrade } from '../api/economyApi'

export const MAX_IDLE_SECONDS = 8 * 3600

export function upgradeIdleRate(
  upgrade: Pick<MyUpgrade, 'incomePerSecond' | 'level'>,
): number {
  if (upgrade.level <= 0 || upgrade.incomePerSecond <= 0) return 0
  return upgrade.incomePerSecond * upgrade.level
}

export function totalIdleIncomePerSecond(
  upgrades: Pick<MyUpgrade, 'incomePerSecond' | 'level'>[],
): number {
  return upgrades.reduce((sum, upgrade) => sum + upgradeIdleRate(upgrade), 0)
}

export function pendingIdleAmount(
  incomePerSecond: number,
  lastIdleCollectedAt: string,
  nowMs: number = Date.now(),
): number {
  if (incomePerSecond <= 0) return 0
  const lastMs = Date.parse(lastIdleCollectedAt)
  if (Number.isNaN(lastMs)) return 0
  const seconds = Math.min(MAX_IDLE_SECONDS, Math.max(0, Math.floor((nowMs - lastMs) / 1000)))
  return Math.round(incomePerSecond * seconds * 100) / 100
}

export function formatIncomeRate(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value)
}
