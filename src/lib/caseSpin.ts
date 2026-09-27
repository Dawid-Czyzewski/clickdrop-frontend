import type { CaseDrop } from '../api/casesApi'

export const SPIN_ITEM_WIDTH = 168
export const SPIN_STRIP_LENGTH = 52
export const SPIN_WINNER_INDEX = 44
export const SPIN_DURATION_MS = 5500

function pickWeighted(drops: CaseDrop[], random = Math.random): CaseDrop {
  const total = drops.reduce((sum, drop) => sum + drop.weight, 0)
  let roll = random() * total
  for (const drop of drops) {
    roll -= drop.weight
    if (roll <= 0) return drop
  }
  return drops[drops.length - 1]!
}

export function buildSpinStrip(
  drops: CaseDrop[],
  winnerCode: string,
  options: { length?: number; winnerIndex?: number; random?: () => number } = {},
): CaseDrop[] {
  const length = options.length ?? SPIN_STRIP_LENGTH
  const winnerIndex = options.winnerIndex ?? SPIN_WINNER_INDEX
  const random = options.random ?? Math.random
  const winner =
    drops.find((drop) => drop.code === winnerCode) ??
    ({
      itemId: -1,
      code: winnerCode,
      rarity: 'MIL_SPEC',
      weight: 1,
    } satisfies CaseDrop)

  if (drops.length === 0) {
    return Array.from({ length }, () => winner)
  }

  return Array.from({ length }, (_, index) => {
    if (index === winnerIndex) return winner
    return pickWeighted(drops, random)
  })
}

export function spinOffsetPx(
  winnerIndex: number,
  viewportWidth: number,
  itemWidth = SPIN_ITEM_WIDTH,
): number {
  return -(winnerIndex * itemWidth) + viewportWidth / 2 - itemWidth / 2
}
