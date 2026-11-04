'use client'

import { useRef, useState } from 'react'

export type DeferredLevelUp = {
  level: number
  reward: number
}

export function useDeferredLevelUpModal() {
  const pendingRef = useRef<DeferredLevelUp | null>(null)
  const [levelUp, setLevelUp] = useState<DeferredLevelUp | null>(null)
  const [goInventoryAfterLevelUp, setGoInventoryAfterLevelUp] = useState(false)

  function queueLevelUp(level: number, reward = 0) {
    pendingRef.current = { level, reward }
  }

  function revealLevelUpAfterDrop(options?: { thenInventory?: boolean }): boolean {
    const pending = pendingRef.current
    pendingRef.current = null

    if (pending != null) {
      setLevelUp(pending)
      setGoInventoryAfterLevelUp(Boolean(options?.thenInventory))
      return false
    }

    return Boolean(options?.thenInventory)
  }

  function closeLevelUp(onInventory?: () => void) {
    setLevelUp(null)
    if (goInventoryAfterLevelUp) {
      setGoInventoryAfterLevelUp(false)
      onInventory?.()
    }
  }

  return {
    levelUp,
    queueLevelUp,
    revealLevelUpAfterDrop,
    closeLevelUp,
  }
}
