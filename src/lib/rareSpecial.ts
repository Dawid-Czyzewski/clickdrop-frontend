import type { CaseDrop } from '../api/casesApi'

export const RARE_SPECIAL_COLOR = '#e4ae39'

export const RARE_SPECIAL_CODE = 'RARE_SPECIAL'

export function isRareSpecialItem(code: string, displayName?: string | null): boolean {
  if (displayName?.trim().startsWith('★')) return true
  return /(KNIFE|GLOVES|HAND_WRAPS|SHADOW_DAGGERS)/.test(code)
}

export type CaseDropView =
  | { kind: 'item'; drop: CaseDrop }
  | {
      kind: 'rareSpecial'
      weight: number
      chancePercent?: number
      count: number
    }

export function collapseRareSpecialDrops(drops: CaseDrop[]): CaseDropView[] {
  const normal: CaseDropView[] = []
  let rareWeight = 0
  let rareChanceSum = 0
  let rareChanceKnown = true
  let rareCount = 0

  for (const drop of drops) {
    if (isRareSpecialItem(drop.code, drop.displayName)) {
      rareWeight += drop.weight
      rareCount += 1
      if (drop.chancePercent != null && Number.isFinite(Number(drop.chancePercent))) {
        rareChanceSum += Number(drop.chancePercent)
      } else {
        rareChanceKnown = false
      }
    } else {
      normal.push({ kind: 'item', drop })
    }
  }

  const views = [...normal]
  if (rareCount > 0) {
    views.push({
      kind: 'rareSpecial',
      weight: rareWeight,
      count: rareCount,
      ...(rareChanceKnown ? { chancePercent: rareChanceSum } : {}),
    })
  }

  return views.sort((a, b) => {
    const wa = a.kind === 'item' ? a.drop.weight : a.weight
    const wb = b.kind === 'item' ? b.drop.weight : b.weight
    return wa - wb
  })
}
