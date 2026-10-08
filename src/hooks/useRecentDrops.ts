import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRecentDrops, type RecentDrop } from '../api/dropsApi'
import { resolveRecentDropsError } from '../api/resolveRecentDropsError'

const DEFAULT_POLL_MS = 20_000
const DEFAULT_LIMIT = 20

type UseRecentDropsOptions = {
  enabled?: boolean
  pollMs?: number
  limit?: number
}

export function useRecentDrops(options: UseRecentDropsOptions = {}) {
  const { enabled = true, pollMs = DEFAULT_POLL_MS, limit = DEFAULT_LIMIT } = options
  const { t } = useTranslation()
  const [drops, setDrops] = useState<RecentDrop[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setDrops([])
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    let first = true

    async function load() {
      if (first) setIsLoading(true)
      try {
        const data = await getRecentDrops(limit)
        if (!cancelled) {
          setDrops(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          if (first) setDrops([])
          setError(resolveRecentDropsError(err, t))
        }
      } finally {
        if (!cancelled && first) {
          setIsLoading(false)
          first = false
        }
      }
    }

    void load()
    const id = window.setInterval(() => {
      void load()
    }, pollMs)

    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [enabled, limit, pollMs, t])

  return { drops, isLoading, error }
}
