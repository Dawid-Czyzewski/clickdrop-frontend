'use client'

import { LevelUpModal } from '../home/LevelUpModal'
import { InventorySoldToast } from '../inventory/InventorySoldToast'

type SoldToastState = {
  id: number
  amount: number
} | null

type CaseDetailOverlaysProps = {
  levelUpLevel: number | null
  soldToast: SoldToastState
  onCloseLevelUp: () => void
  onDismissSoldToast: () => void
}

export function CaseDetailOverlays({
  levelUpLevel,
  soldToast,
  onCloseLevelUp,
  onDismissSoldToast,
}: CaseDetailOverlaysProps) {
  return (
    <>
      {levelUpLevel != null ? (
        <LevelUpModal level={levelUpLevel} onClose={onCloseLevelUp} />
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
