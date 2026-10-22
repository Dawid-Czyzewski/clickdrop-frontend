import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getMyLeaderboardRank, type MyLeaderboardRank } from '../api/usersApi'
import { resolveLeaderboardError } from '../api/resolveLeaderboardError'

type UseMyLeaderboardRankOptions = {
  enabled?: boolean
}

export function useMyLeaderboardRank(options: UseMyLeaderboardRankOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [myRank, setMyRank] = useState<MyLeaderboardRank | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setMyRank(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getMyLeaderboardRank()
      .then((data) => {
        if (!cancelled) setMyRank(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setMyRank(null)
          setError(resolveLeaderboardError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  return { myRank, isLoading, error }
}
