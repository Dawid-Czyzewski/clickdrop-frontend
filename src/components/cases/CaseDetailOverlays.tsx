'use client'

import type { DeferredLevelUp } from '../../hooks/useDeferredLevelUpModal'
import { LevelUpModal } from '../home/LevelUpModal'
import { InventorySoldToast } from '../inventory/InventorySoldToast'

type SoldToastState = {
  id: number
  amount: number
} | null

type CaseDetailOverlaysProps = {
  levelUp: DeferredLevelUp | null
  soldToast: SoldToastState
  onCloseLevelUp: () => void
  onDismissSoldToast: () => void
}

export function CaseDetailOverlays({
  levelUp,
  soldToast,
  onCloseLevelUp,
  onDismissSoldToast,
}: CaseDetailOverlaysProps) {
  return (
    <>
      {levelUp != null ? (
        <LevelUpModal
          level={levelUp.level}
          reward={levelUp.reward}
          onClose={onCloseLevelUp}
        />
      ) : null}
      {soldToast ? (
        <InventorySoldToast
          amount={soldToast.amount}
          toastKey={soldToast.id}
          onDismiss={onDismissSoldToast}
        />
      ) : null}
    </>
  )
}
