import type { MyUpgrade } from '../api/economyApi'

/** Matches economy-service ClickRewardService.BASE_CLICK_REWARD */
export const BASE_CLICK_REWARD = 1

export function upgradeBonusPerClick(upgrade: Pick<MyUpgrade, 'clickPower' | 'level'>): number {
  if (upgrade.level <= 0) return 0
  return upgrade.clickPower * upgrade.level
}

export function totalClickReward(upgrades: Pick<MyUpgrade, 'clickPower' | 'level'>[]): number {
  const bonus = upgrades.reduce((sum, upgrade) => sum + upgradeBonusPerClick(upgrade), 0)
  return BASE_CLICK_REWARD + bonus
}
