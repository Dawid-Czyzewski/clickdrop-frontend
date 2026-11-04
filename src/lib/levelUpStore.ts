export type LevelUpEvent = {
  level: number
  reward: number
}

type LevelUpListener = (event: LevelUpEvent) => void

const listeners = new Set<LevelUpListener>()

export function emitLevelUp(level: number, reward = 0): void {
  const event: LevelUpEvent = { level, reward }
  listeners.forEach((listener) => listener(event))
}

export function subscribeLevelUp(listener: LevelUpListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function resetLevelUpListeners(): void {
  listeners.clear()
}
