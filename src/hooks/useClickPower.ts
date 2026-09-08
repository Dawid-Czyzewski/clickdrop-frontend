import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getClickPower } from '../api/economyApi'
import { resolveEconomyError } from '../api/resolveEconomyError'

type UseClickPowerOptions = {
  enabled?: boolean
}

export function useClickPower(options: UseClickPowerOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [rewardPerClick, setRewardPerClick] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setRewardPerClick(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getClickPower()
      .then((data) => {
        if (!cancelled) setRewardPerClick(data.rewardPerClick)
      })
      .catch((err) => {
        if (!cancelled) {
          setRewardPerClick(null)
          setError(resolveEconomyError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  async function refresh() {
    if (!enabled) return null

    try {
      const data = await getClickPower()
      setRewardPerClick(data.rewardPerClick)
      setError('')
      return data.rewardPerClick
    } catch (err) {
      setError(resolveEconomyError(err, t))
      return null
    }
  }

  return { rewardPerClick, isLoading, error, refresh }
}
