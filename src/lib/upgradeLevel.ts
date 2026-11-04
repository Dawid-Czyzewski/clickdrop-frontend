import type { MyUpgrade } from '../api/economyApi'

export function upgradeMinLevel(upgrade: Pick<MyUpgrade, 'minLevel'>): number {
  return upgrade.minLevel ?? 1
}

export function isUpgradeLevelLocked(
  upgrade: Pick<MyUpgrade, 'minLevel'>,
  userLevel: number | null | undefined,
): boolean {
  return (userLevel ?? 0) < upgradeMinLevel(upgrade)
}
