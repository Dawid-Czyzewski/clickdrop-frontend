import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getInventory,
  openCase as postOpenCase,
  sellInventoryBatch as postSellBatch,
  sellInventoryItem as postSell,
  type InventoryItem,
  type OpenCasesResponse,
  type SellInventoryBatchResponse,
  type SellInventoryItemResponse,
} from '../api/casesApi'
import { resolveCaseError } from '../api/resolveCaseError'

type UseInventoryOptions = {
  enabled?: boolean
}

export function useInventory(options: UseInventoryOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [openingCaseId, setOpeningCaseId] = useState<number | null>(null)
  const [sellingId, setSellingId] = useState<number | null>(null)
  const [isSellingBatch, setIsSellingBatch] = useState(false)
  const [error, setError] = useState('')
  const busyRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setItems([])
      setError('')
      setIsLoading(false)
      setIsSellingBatch(false)
      busyRef.current = false
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getInventory()
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setItems([])
          setError(resolveCaseError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  async function openCase(
    caseId: number,
    count = 1,
  ): Promise<OpenCasesResponse | null> {
    if (!enabled || busyRef.current) return null

    busyRef.current = true
    setOpeningCaseId(caseId)
    setError('')

    try {
      const result = await postOpenCase(caseId, count)
      const refreshed = await getInventory()
      setItems(refreshed)
      return result
    } catch (err) {
      setError(resolveCaseError(err, t))
      return null
    } finally {
      busyRef.current = false
      setOpeningCaseId(null)
    }
  }

  async function sellItem(inventoryItemId: number): Promise<SellInventoryItemResponse | null> {
    if (!enabled || busyRef.current) return null

    busyRef.current = true
    setSellingId(inventoryItemId)
    setError('')

    try {
      const result = await postSell(inventoryItemId)
      setItems((prev) => prev.filter((item) => item.inventoryItemId !== inventoryItemId))
      return result
    } catch (err) {
      setError(resolveCaseError(err, t))
      return null
    } finally {
      busyRef.current = false
      setSellingId(null)
    }
  }

  async function sellBatch(
    inventoryItemIds: number[],
  ): Promise<SellInventoryBatchResponse | null> {
    if (!enabled || busyRef.current || inventoryItemIds.length === 0) return null

    busyRef.current = true
    setIsSellingBatch(true)
    setError('')

    try {
      const result = await postSellBatch(inventoryItemIds)
      const soldIds = new Set(result.sold.map((row) => row.inventoryItemId))
      setItems((prev) => prev.filter((item) => !soldIds.has(item.inventoryItemId)))
      return result
    } catch (err) {
      setError(resolveCaseError(err, t))
      return null
    } finally {
      busyRef.current = false
      setIsSellingBatch(false)
    }
  }

  return {
    items,
    isLoading,
    openingCaseId,
    sellingId,
    isSellingBatch,
    error,
    openCase,
    sellItem,
    sellBatch,
    refresh: async () => {
      if (!enabled) return
      try {
        const data = await getInventory()
        setItems(data)
      } catch (err) {
        setError(resolveCaseError(err, t))
      }
    },
    removeItem: (inventoryItemId: number) => {
      setItems((prev) => prev.filter((item) => item.inventoryItemId !== inventoryItemId))
    },
    clearError: () => setError(''),
  }
}
