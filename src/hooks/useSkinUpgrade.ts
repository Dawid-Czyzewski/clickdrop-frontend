import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getSkinUpgradePreview,
  upgradeSkin,
  type SkinUpgradeChoice,
  type SkinUpgradePreview,
  type SkinUpgradeResult,
} from '../api/skinUpgradeApi'
import { resolveSkinUpgradeError } from '../api/resolveSkinUpgradeError'
import { filterTargetsInPriceBand } from '../lib/skinUpgradePricing'

export function useSkinUpgrade() {
  const { t } = useTranslation()
  const [preview, setPreview] = useState<SkinUpgradePreview | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState('')
  const busyRef = useRef(false)

  const loadPreview = useCallback(
    async (inventoryItemId: number): Promise<SkinUpgradePreview | null> => {
      if (busyRef.current) return null
      busyRef.current = true
      setIsLoadingPreview(true)
      setError('')
      setPreview(null)

      try {
        const data = await getSkinUpgradePreview(inventoryItemId)
        const banded: SkinUpgradePreview = {
          ...data,
          possibleTargets: filterTargetsInPriceBand(
            data.current.suggestedSellPrice,
            data.possibleTargets,
          ),
        }
        setPreview(banded)
        return banded
      } catch (err) {
        setError(resolveSkinUpgradeError(err, t))
        return null
      } finally {
        busyRef.current = false
        setIsLoadingPreview(false)
      }
    },
    [t],
  )

  const runUpgrade = useCallback(
    async (
      inventoryItemId: number,
      choice: SkinUpgradeChoice,
    ): Promise<SkinUpgradeResult | null> => {
      if (busyRef.current) return null
      busyRef.current = true
      setIsUpgrading(true)
      setError('')

      try {
        return await upgradeSkin(inventoryItemId, choice)
      } catch (err) {
        setError(resolveSkinUpgradeError(err, t))
        return null
      } finally {
        busyRef.current = false
        setIsUpgrading(false)
      }
    },
    [t],
  )

  function clearPreview() {
    setPreview(null)
    setError('')
  }

  return {
    preview,
    isLoadingPreview,
    isUpgrading,
    error,
    loadPreview,
    runUpgrade,
    clearPreview,
    clearError: () => setError(''),
  }
}
