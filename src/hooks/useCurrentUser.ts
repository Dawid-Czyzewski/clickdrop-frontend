import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../api/client'
import { getCurrentUser, type CurrentUser } from '../api/usersApi'
import {
  getSharedCurrentUser,
  patchSharedCurrentUserStats,
  setSharedCurrentUser,
  subscribeSharedCurrentUser,
} from '../lib/currentUserStore'

function resolveFetchError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return t('profile.errorUnauthorized')
    if (err.status >= 500) return t('profile.errorServer')
  }

  return t('profile.error')
}

type UseCurrentUserOptions = {
  enabled?: boolean
}

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [user, setUser] = useState<CurrentUser | null>(() =>
    enabled ? getSharedCurrentUser() : null,
  )
  const [isLoading, setIsLoading] = useState(enabled && getSharedCurrentUser() === null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setUser(null)
      setError('')
      setIsLoading(false)
      return
    }

    return subscribeSharedCurrentUser((next) => {
      setUser(next)
    })
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const cached = getSharedCurrentUser()
    if (cached !== null) {
      setUser(cached)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
    setError('')

    getCurrentUser()
      .then((data) => {
        if (!cancelled) setSharedCurrentUser(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setSharedCurrentUser(null)
          setError(resolveFetchError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  function applyLevelExperience(
    stats: { level?: number; experience?: number },
    options?: { emitLevelUp?: boolean },
  ) {
    patchSharedCurrentUserStats(stats, options)
    setError('')
  }

  return { user, isLoading, error, applyLevelExperience }
}
