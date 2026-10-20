import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sellInventoryItem, type InventoryItem } from '../api/casesApi'
import {
  isSkinUpgradeSuccess,
  type SkinUpgradeChoice,
  type SkinUpgradeResult,
  type SkinUpgradeSuccess,
} from '../api/skinUpgradeApi'
import { prefersReducedMotion } from '../lib/caseAnimationPreference'
import { useSkinUpgrade } from './useSkinUpgrade'

export type SkinUpgradePhase = 'select' | 'preview' | 'animating' | 'fail'

type SkinUpgradeFlowOptions = {
  refreshInventory: () => Promise<void>
  removeInventoryItem: (inventoryItemId: number) => void
}

export function useSkinUpgradeFlow(
  items: InventoryItem[],
  inventoryLoading: boolean,
  options: SkinUpgradeFlowOptions,
) {
  const { refreshInventory, removeInventoryItem } = options
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemParam = searchParams.get('item')
  const [phase, setPhase] = useState<SkinUpgradePhase>('select')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [outcome, setOutcome] = useState<SkinUpgradeResult | null>(null)
  const [successDrop, setSuccessDrop] = useState<SkinUpgradeSuccess | null>(null)
  const [backdropCodes, setBackdropCodes] = useState<string[]>([])
  const [selling, setSelling] = useState(false)

  const {
    preview,
    isLoadingPreview,
    isUpgrading,
    error: upgradeError,
    loadPreview,
    runUpgrade,
    clearPreview,
  } = useSkinUpgrade()

  const selectItem = useCallback(
    async (id: number) => {
      setSelectedId(id)
      setConfirming(false)
      setOutcome(null)
      setSuccessDrop(null)
      const data = await loadPreview(id)
      if (data) setPhase('preview')
    },
    [loadPreview],
  )

  useEffect(() => {
    if (inventoryLoading || !itemParam) return
    const id = Number(itemParam)
    if (!Number.isFinite(id) || selectedId === id) return
    if (!items.some((i) => i.inventoryItemId === id)) return
    void selectItem(id)
  }, [inventoryLoading, itemParam, items, selectedId, selectItem])

  async function confirmUpgrade(choice: SkinUpgradeChoice) {
    if (selectedId == null) return
    const lostId = selectedId
    const result = await runUpgrade(selectedId, choice)
    if (!result) {
      setConfirming(false)
      return
    }
    setConfirming(false)
    setOutcome(result)
    setBackdropCodes(preview?.possibleTargets.map((x) => x.itemCode) ?? [])
    if (prefersReducedMotion()) await finishOutcome(result, lostId)
    else setPhase('animating')
  }

  async function finishOutcome(result: SkinUpgradeResult, lostId = selectedId) {
    if (lostId != null) removeInventoryItem(lostId)
    void refreshInventory()

    if (isSkinUpgradeSuccess(result)) {
      setSuccessDrop({
        ...result,
        statTrack: result.statTrack ?? preview?.current.statTrack,
      })
      setPhase('select')
      clearPreview()
      setSelectedId(null)
      setOutcome(null)
    } else {
      clearPreview()
      setSelectedId(null)
      setPhase('fail')
    }
  }

  function resetToSelect() {
    setPhase('select')
    setSelectedId(null)
    setConfirming(false)
    setOutcome(null)
    setSuccessDrop(null)
    setBackdropCodes([])
    clearPreview()
    void refreshInventory()
  }

  async function sellSuccess() {
    if (!successDrop) return
    setSelling(true)
    try {
      await sellInventoryItem(successDrop.inventoryItemId)
      setSuccessDrop(null)
      void refreshInventory()
    } finally {
      setSelling(false)
    }
  }

  function keepSuccess() {
    setSuccessDrop(null)
    void refreshInventory()
  }

  return {
    phase,
    selectedId,
    confirming,
    outcome,
    successDrop,
    backdropCodes,
    selling,
    preview,
    isLoadingPreview,
    isUpgrading,
    upgradeError,
    busy: isLoadingPreview || isUpgrading,
    selectItem,
    setConfirming,
    confirmUpgrade,
    resetToSelect,
    finishAnim: () => {
      if (outcome) void finishOutcome(outcome, selectedId)
    },
    sellSuccess,
    keepSuccess,
    goInventory: () => router.push('/inventory'),
  }
}
