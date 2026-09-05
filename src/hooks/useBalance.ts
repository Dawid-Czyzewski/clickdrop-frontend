import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../api/client'
import { getBalance } from '../api/economyApi'

function resolveBalanceError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return t('home.earn.errorUnauthorized')
    if (err.status === 404) return t('home.earn.errorNotFound')
    if (err.status >= 500) return t('home.earn.errorServer')
  }

  return t('home.earn.error')
}

type UseBalanceOptions = {
  enabled?: boolean
}

export function useBalance(options: UseBalanceOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setBalance(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getBalance()
      .then((data) => {
        if (!cancelled) setBalance(data.balance)
      })
      .catch((err) => {
        if (!cancelled) {
          setBalance(null)
          setError(resolveBalanceError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  return { balance, isLoading, error }
}
