type LevelUpListener = (level: number) => void

const listeners = new Set<LevelUpListener>()

export function emitLevelUp(level: number): void {
  listeners.forEach((listener) => listener(level))
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
