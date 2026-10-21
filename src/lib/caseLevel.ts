import type { GameCase } from '../api/casesApi'

export function caseMinLevel(gameCase: Pick<GameCase, 'minLevel'>): number {
  return gameCase.minLevel ?? 1
}

export function isCaseLevelLocked(
  gameCase: Pick<GameCase, 'minLevel'>,
  userLevel: number | null | undefined,
): boolean {
  return (userLevel ?? 0) < caseMinLevel(gameCase)
}

export function compareCasesByLevel(
  a: Pick<GameCase, 'minLevel' | 'sortOrder'>,
  b: Pick<GameCase, 'minLevel' | 'sortOrder'>,
): number {
  const byLevel = caseMinLevel(a) - caseMinLevel(b)
  if (byLevel !== 0) return byLevel
  return a.sortOrder - b.sortOrder
}
