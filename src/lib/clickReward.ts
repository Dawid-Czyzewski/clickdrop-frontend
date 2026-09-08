import type { MyUpgrade } from '../api/economyApi'

export function upgradeBonusPerClick(upgrade: Pick<MyUpgrade, 'clickPower' | 'level'>): number {
  if (upgrade.level <= 0) return 0
  return upgrade.clickPower * upgrade.level
}
