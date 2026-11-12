'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { InventoryItem, ItemRarity } from '../api/casesApi'
import { resolveTradeUpError } from '../api/resolveTradeUpError'
import { tradeUp, type TradeUpResponse } from '../api/tradeUpApi'
import { canTradeUp, TRADE_UP_COUNT, validateTradeUp } from '../lib/tradeUpEligibility'

type Phase = 'select' | 'confirm' | 'submitting' | 'result'

export function useTradeUpFlow(
  items: InventoryItem[],
  options: { refreshInventory: () => Promise<void> },
) {
  const { t } = useTranslation()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [rarityFilter, setRarityFilter] = useState<ItemRarity | 'all'>('all')
  const [phase, setPhase] = useState<Phase>('select')
  const [error, setError] = useState('')
  const [result, setResult] = useState<TradeUpResponse | null>(null)

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.inventoryItemId)),
    [items, selectedIds],
  )

  const validation = validateTradeUp(selectedItems)
  const ready = canTradeUp(selectedItems)
  const busy = phase === 'submitting'

  const visibleItems = useMemo(() => {
    if (rarityFilter === 'all') return items
    return items.filter((item) => item.rarity === rarityFilter)
  }, [items, rarityFilter])

  function toggleSelect(inventoryItemId: number) {
    if (busy || phase === 'result') return
    setError('')
    setSelectedIds((prev) => {
      if (prev.includes(inventoryItemId)) {
        return prev.filter((id) => id !== inventoryItemId)
      }
      if (prev.length >= TRADE_UP_COUNT) return prev
      return [...prev, inventoryItemId]
    })
  }

  function clearSelection() {
    if (busy) return
    setSelectedIds([])
    setError('')
  }

  function requestConfirm() {
    if (!ready || busy) return
    setError('')
    setPhase('confirm')
  }

  function cancelConfirm() {
    if (busy) return
    setPhase('select')
  }

  async function confirmTradeUp() {
    if (!ready || busy) return
    setPhase('submitting')
    setError('')
    try {
      const response = await tradeUp(selectedIds)
      await options.refreshInventory()
      setResult(response)
      setSelectedIds([])
      setPhase('result')
    } catch (err) {
      setError(resolveTradeUpError(err, t))
      setPhase('select')
    }
  }

  function dismissResult() {
    setResult(null)
    setPhase('select')
  }

  return {
    selectedIds,
    selectedItems,
    visibleItems,
    rarityFilter,
    setRarityFilter,
    phase,
    error,
    result,
    validation,
    ready,
    busy,
    toggleSelect,
    clearSelection,
    requestConfirm,
    cancelConfirm,
    confirmTradeUp,
    dismissResult,
  }
}
