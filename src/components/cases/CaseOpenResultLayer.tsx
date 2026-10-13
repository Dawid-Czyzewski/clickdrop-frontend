'use client'

import type { CaseDrop, OpenCasesResponse, OpenedCaseDrop } from '../../api/casesApi'
import { CaseOpenMultiResultModal } from './CaseOpenMultiResultModal'
import { CaseOpenMultiSpinner } from './CaseOpenMultiSpinner'
import { CaseOpenResultModal } from './CaseOpenResultModal'
import { CaseOpenSpinner } from './CaseOpenSpinner'

type CaseOpenResultLayerProps = {
  drops: CaseDrop[]
  openResult: OpenCasesResponse | null
  spinning: boolean
  singleDrop: OpenedCaseDrop | null | undefined
  multiDrops: OpenedCaseDrop[] | null
  sellingId: number | null
  isSellingBatch: boolean
  onSpinComplete: () => void
  onDismiss: (options?: { thenInventory?: boolean }) => void
  onSellNow: () => void
  onSellAll: () => void
}

export function CaseOpenResultLayer({
  drops,
  openResult,
  spinning,
  singleDrop,
  multiDrops,
  sellingId,
  isSellingBatch,
  onSpinComplete,
  onDismiss,
  onSellNow,
  onSellAll,
}: CaseOpenResultLayerProps) {
  const multiSpinning = spinning && multiDrops != null && multiDrops.length > 0

  return (
    <>
      {spinning && singleDrop ? (
        <CaseOpenSpinner
          drops={drops}
          winnerCode={singleDrop.itemCode}
          onComplete={onSpinComplete}
        />
      ) : null}

      {multiSpinning ? (
        <CaseOpenMultiSpinner
          drops={drops}
          winners={multiDrops.map((drop) => drop.itemCode)}
          onComplete={onSpinComplete}
        />
      ) : null}

      {!spinning && singleDrop && openResult ? (
        <CaseOpenResultModal
          drop={{ ...singleDrop, experienceGained: openResult.experienceGained }}
          isSelling={sellingId === singleDrop.inventoryItemId}
          onClose={() => onDismiss()}
          onKeep={() => onDismiss({ thenInventory: true })}
          onSell={onSellNow}
          backdropCodes={drops.map((d) => d.code)}
        />
      ) : null}

      {!spinning && multiDrops && openResult ? (
        <CaseOpenMultiResultModal
          drops={multiDrops}
          experienceGained={openResult.experienceGained}
          isSelling={isSellingBatch}
          onClose={() => onDismiss()}
          onKeep={() => onDismiss({ thenInventory: true })}
          onSellAll={onSellAll}
        />
      ) : null}
    </>
  )
}
