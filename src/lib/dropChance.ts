export function totalDropWeight(weights: number[]): number {
  return weights.reduce((sum, weight) => sum + weight, 0)
}

export function dropChancePercent(weight: number, totalWeight: number): number {
  if (totalWeight <= 0) return 0
  return (weight / totalWeight) * 100
}

export function resolveDropChancePercent(
  drop: { weight: number; chancePercent?: number | null },
  totalWeight: number,
): number {
  if (drop.chancePercent != null && Number.isFinite(Number(drop.chancePercent))) {
    return Number(drop.chancePercent)
  }
  return dropChancePercent(drop.weight, totalWeight)
}

export function formatDropChanceNumber(percent: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(percent)
}

export function formatDropChance(percent: number, locale: string): string {
  return `${formatDropChanceNumber(percent, locale)}%`
}
