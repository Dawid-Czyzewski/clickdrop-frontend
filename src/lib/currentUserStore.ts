import type { CurrentUser } from '../api/usersApi'
import { levelUpCashReward } from './levelUpCashReward'
import { emitLevelUp } from './levelUpStore'

type CurrentUserListener = (user: CurrentUser | null) => void

let sharedUser: CurrentUser | null = null
let knownLevel: number | null = null
const listeners = new Set<CurrentUserListener>()

export function getSharedCurrentUser(): CurrentUser | null {
  return sharedUser
}

export function setSharedCurrentUser(next: CurrentUser | null): void {
  if (next === null) {
    sharedUser = null
    knownLevel = null
    listeners.forEach((listener) => listener(null))
    return
  }

  const previousLevel = knownLevel
  sharedUser = next
  knownLevel = next.level
  listeners.forEach((listener) => listener(next))

  if (previousLevel !== null && next.level > previousLevel) {
    emitLevelUp(next.level, levelUpCashReward(previousLevel, next.level))
  }
}

export function patchSharedCurrentUserStats(
  stats: {
    level?: number
    experience?: number
  },
  options: { emitLevelUp?: boolean } = {},
): void {
  if (stats.level === undefined && stats.experience === undefined) return
  if (!sharedUser) return

  const emit = options.emitLevelUp !== false
  const previousLevel = knownLevel
  const next = {
    ...sharedUser,
    level: stats.level ?? sharedUser.level,
    experience: stats.experience ?? sharedUser.experience,
  }
  sharedUser = next
  knownLevel = next.level
  listeners.forEach((listener) => listener(next))

  if (emit && previousLevel !== null && next.level > previousLevel) {
    emitLevelUp(next.level, levelUpCashReward(previousLevel, next.level))
  }
}

export function subscribeSharedCurrentUser(listener: CurrentUserListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function resetSharedCurrentUser(): void {
  sharedUser = null
  knownLevel = null
  listeners.clear()
}
