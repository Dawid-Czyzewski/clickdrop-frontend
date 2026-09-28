export const XP_PER_LEVEL = 100

export type LevelProgress = {
  currentXp: number
  xpForLevel: number
  ratio: number
}

export function levelProgress(experience: number): LevelProgress {
  const safeXp = Math.max(0, Math.floor(experience))
  const currentXp = safeXp % XP_PER_LEVEL
  return {
    currentXp,
    xpForLevel: XP_PER_LEVEL,
    ratio: currentXp / XP_PER_LEVEL,
  }
}
