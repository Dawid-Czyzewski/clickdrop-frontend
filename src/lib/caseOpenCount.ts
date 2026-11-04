import type { GameCase } from '../api/casesApi'

export type CaseOpenCount = 1 | 3 | 5

export const CASE_OPEN_COUNT_OPTIONS: CaseOpenCount[] = [1, 3, 5]

export const DEFAULT_OPEN_X3_MIN_LEVEL = 5
export const DEFAULT_OPEN_X5_MIN_LEVEL = 10
export const DEFAULT_MAX_OPEN_COUNT = 5

export function caseOpenX3MinLevel(
  gameCase: Pick<GameCase, 'openX3MinLevel'>,
): number {
  return gameCase.openX3MinLevel ?? DEFAULT_OPEN_X3_MIN_LEVEL
}

export function caseOpenX5MinLevel(
  gameCase: Pick<GameCase, 'openX5MinLevel'>,
): number {
  return gameCase.openX5MinLevel ?? DEFAULT_OPEN_X5_MIN_LEVEL
}

export function caseMaxOpenCount(
  gameCase: Pick<GameCase, 'maxOpenCount'>,
): number {
  return gameCase.maxOpenCount ?? DEFAULT_MAX_OPEN_COUNT
}

export function requiredLevelForOpenCount(
  gameCase: Pick<GameCase, 'openX3MinLevel' | 'openX5MinLevel'>,
  count: CaseOpenCount,
): number {
  if (count >= 5) return caseOpenX5MinLevel(gameCase)
  if (count >= 3) return caseOpenX3MinLevel(gameCase)
  return 1
}

export function maxOpenCountForLevel(
  gameCase: Pick<GameCase, 'openX3MinLevel' | 'openX5MinLevel' | 'maxOpenCount'>,
  userLevel: number | null | undefined,
): CaseOpenCount {
  const level = userLevel ?? 0
  const cap = caseMaxOpenCount(gameCase)
  let allowed: CaseOpenCount = 1
  if (level >= caseOpenX5MinLevel(gameCase)) allowed = 5
  else if (level >= caseOpenX3MinLevel(gameCase)) allowed = 3
  if (allowed > cap) {
    if (cap >= 5) return 5
    if (cap >= 3) return 3
    return 1
  }
  return allowed
}

export function isOpenCountLocked(
  gameCase: Pick<GameCase, 'openX3MinLevel' | 'openX5MinLevel' | 'maxOpenCount'>,
  count: CaseOpenCount,
  userLevel: number | null | undefined,
): boolean {
  return count > maxOpenCountForLevel(gameCase, userLevel)
}

export function clampOpenCount(
  gameCase: Pick<GameCase, 'openX3MinLevel' | 'openX5MinLevel' | 'maxOpenCount'>,
  count: CaseOpenCount,
  userLevel: number | null | undefined,
): CaseOpenCount {
  const max = maxOpenCountForLevel(gameCase, userLevel)
  return count > max ? max : count
}
