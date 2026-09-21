export function totalDropWeight(weights: number[]): number {
  return weights.reduce((sum, weight) => sum + weight, 0)
}

export function dropChancePercent(weight: number, totalWeight: number): number {
  if (totalWeight <= 0) return 0
  return (weight / totalWeight) * 100
}

export function formatDropChance(percent: number, locale: string): string {
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(percent)}%`
}
