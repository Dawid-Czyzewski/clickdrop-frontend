'use client'

import type { CaseDrop } from '../../api/casesApi'
import {
  isDailyCashClaim,
  isDailySkinClaim,
  type DailyClaimResponse,
  type DailyDrop,
} from '../../api/dailyApi'
import type { SoldToast } from '../../hooks/useSoldToast'
import { CaseOpenResultModal } from '../cases/CaseOpenResultModal'
import { CaseOpenSpinner } from '../cases/CaseOpenSpinner'
import { InventorySoldToast } from '../inventory/InventorySoldToast'
import { DailyCashResultModal } from './DailyCashResultModal'

type DailyFreeResultOverlayProps = {
  spinning: boolean
  drop: DailyClaimResponse | null
  spinPool: CaseDrop[]
  winnerCode: string
  drops: DailyDrop[]
  isSelling: boolean
  soldToast: SoldToast | null
  onSpinComplete: () => void
  onKeepDrop: () => void
  onKeep: () => void
  onSell: () => void
  onDismissSoldToast: () => void
}

export function DailyFreeResultOverlay({
  spinning,
  drop,
  spinPool,
  winnerCode,
  drops,
  isSelling,
  soldToast,
  onSpinComplete,
  onKeepDrop,
  onKeep,
  onSell,
  onDismissSoldToast,
}: DailyFreeResultOverlayProps) {
  return (
    <>
      {spinning && drop ? (
        <CaseOpenSpinner
          drops={spinPool}
          winnerCode={winnerCode}
          onComplete={onSpinComplete}
        />
      ) : null}

      {!spinning && drop && isDailySkinClaim(drop) ? (
        <CaseOpenResultModal
          drop={drop}
          isSelling={isSelling}
          onClose={onKeepDrop}
          onKeep={onKeep}
          onSell={onSell}
          backdropCodes={drops
            .filter((d) => d.type === 'SKIN')
            .map((d) => d.itemCode)}
        />
      ) : null}

      {!spinning && drop && isDailyCashClaim(drop) ? (
        <DailyCashResultModal cashAmount={drop.cashAmount} onClose={onKeepDrop} />
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
