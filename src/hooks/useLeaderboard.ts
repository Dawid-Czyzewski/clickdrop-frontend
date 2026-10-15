import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getLeaderboard, type LeaderboardEntry } from '../api/usersApi'
import { resolveLeaderboardError } from '../api/resolveLeaderboardError'

type UseLeaderboardOptions = {
  enabled?: boolean
  limit?: number
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const { enabled = true, limit = 20 } = options
  const { t } = useTranslation()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setEntries([])
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getLeaderboard(limit)
      .then((data) => {
        if (!cancelled) setEntries(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setEntries([])
          setError(resolveLeaderboardError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, limit, t])

  return { entries, isLoading, error }
}
