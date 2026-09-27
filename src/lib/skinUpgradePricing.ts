import type { SkinUpgradeTarget } from '../api/skinUpgradeApi'

export const SKIN_UPGRADE_MAX_PRICE_MULT = 1.75

export function maxUpgradeTargetPrice(
  currentPrice: number,
  mult = SKIN_UPGRADE_MAX_PRICE_MULT,
): number {
  return Math.round(currentPrice * mult * 100) / 100
}

export function filterTargetsInPriceBand(
  currentPrice: number,
  targets: SkinUpgradeTarget[],
  mult = SKIN_UPGRADE_MAX_PRICE_MULT,
): SkinUpgradeTarget[] {
  const max = maxUpgradeTargetPrice(currentPrice, mult)
  return targets.filter(
    (t) => t.suggestedSellPrice > currentPrice && t.suggestedSellPrice <= max,
  )
}
