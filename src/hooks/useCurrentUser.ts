import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CurrentUser } from '../api/usersApi'
import { getCurrentUser } from '../api/usersApi'
import { ApiError } from '../api/client'

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
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setUser(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getCurrentUser()
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch((err) => {
        if (!cancelled) setError(resolveFetchError(err, t))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  return { user, isLoading, error }
}
