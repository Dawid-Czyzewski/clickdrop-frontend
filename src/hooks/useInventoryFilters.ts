'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_INVENTORY_FILTERS,
  hasActiveInventoryFilters,
  loadInventoryFilters,
  saveInventoryFilters,
  type InventoryFilterState,
} from '../lib/inventoryFilters'

export function useInventoryFilters() {
  const [filters, setFiltersState] = useState<InventoryFilterState>(
    DEFAULT_INVENTORY_FILTERS,
  )

  useEffect(() => {
    setFiltersState(loadInventoryFilters())
  }, [])

  function setFilters(patch: Partial<InventoryFilterState>) {
    setFiltersState((prev) => {
      const next = { ...prev, ...patch }
      saveInventoryFilters(next)
      return next
    })
  }

  function clearFilters() {
    const next = { ...DEFAULT_INVENTORY_FILTERS }
    saveInventoryFilters(next)
    setFiltersState(next)
  }

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters: hasActiveInventoryFilters(filters),
  }
}
