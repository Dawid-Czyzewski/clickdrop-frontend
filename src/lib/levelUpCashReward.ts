export const LEVEL_UP_CASH_PER_LEVEL = 50

export function levelUpCashReward(
  previousLevel: number,
  newLevel: number | null | undefined,
): number {
  if (newLevel == null) return 0
  const gained = newLevel - previousLevel
  if (gained <= 0) return 0
  return gained * LEVEL_UP_CASH_PER_LEVEL
}
