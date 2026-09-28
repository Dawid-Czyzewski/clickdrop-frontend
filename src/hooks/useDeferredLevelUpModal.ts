'use client'

import { useRef, useState } from 'react'

export function useDeferredLevelUpModal() {
  const pendingRef = useRef<number | null>(null)
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null)
  const [goInventoryAfterLevelUp, setGoInventoryAfterLevelUp] = useState(false)

  function queueLevelUp(level: number) {
    pendingRef.current = level
  }
  
  function revealLevelUpAfterDrop(options?: { thenInventory?: boolean }): boolean {
    const pending = pendingRef.current
    pendingRef.current = null

    if (pending != null) {
      setLevelUpLevel(pending)
      setGoInventoryAfterLevelUp(Boolean(options?.thenInventory))
      return false
    }

    return Boolean(options?.thenInventory)
  }

  function closeLevelUp(onInventory?: () => void) {
    setLevelUpLevel(null)
    if (goInventoryAfterLevelUp) {
      setGoInventoryAfterLevelUp(false)
      onInventory?.()
    }
  }

  return {
    levelUpLevel,
    queueLevelUp,
    revealLevelUpAfterDrop,
    closeLevelUp,
  }
}
