import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  buyUpgrade as postBuyUpgrade,
  getMyUpgrades,
  type BuyUpgradeResponse,
  type MyUpgrade,
} from '../api/economyApi'
import { resolveUpgradeError } from '../api/resolveUpgradeError'

type UseUpgradesOptions = {
  enabled?: boolean
}

export function useUpgrades(options: UseUpgradesOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [upgrades, setUpgrades] = useState<MyUpgrade[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [buyingId, setBuyingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const buyingRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setUpgrades([])
      setError('')
      setIsLoading(false)
      setBuyingId(null)
      buyingRef.current = false
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getMyUpgrades()
      .then((data) => {
        if (!cancelled) setUpgrades(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setUpgrades([])
          setError(resolveUpgradeError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  async function buyUpgrade(upgradeId: number): Promise<BuyUpgradeResponse | null> {
    if (!enabled || buyingRef.current || isLoading) {
      return null
    }

    buyingRef.current = true
    setBuyingId(upgradeId)
    setError('')

    try {
      const result = await postBuyUpgrade(upgradeId)
      const refreshed = await getMyUpgrades()
      setUpgrades(refreshed)
      return result
    } catch (err) {
      setError(resolveUpgradeError(err, t))
      return null
    } finally {
      buyingRef.current = false
      setBuyingId(null)
    }
  }

  return { upgrades, isLoading, buyingId, error, buyUpgrade }
}
