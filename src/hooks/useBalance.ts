import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clickToEarn as postClickToEarn, getBalance } from '../api/economyApi'
import { resolveEconomyError } from '../api/resolveEconomyError'

type UseBalanceOptions = {
  enabled?: boolean
}

export function useBalance(options: UseBalanceOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isClicking, setIsClicking] = useState(false)
  const [error, setError] = useState('')
  const isClickingRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setBalance(null)
      setError('')
      setIsLoading(false)
      setIsClicking(false)
      isClickingRef.current = false
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

  async function clickToEarn() {
    if (!enabled || isClickingRef.current || isLoading) {
      return null
    }

    isClickingRef.current = true
    setIsClicking(true)
    setError('')

    try {
      const result = await postClickToEarn()
      setBalance(result.balance)
      return result
    } catch (err) {
      setError(resolveEconomyError(err, t))
      return null
    } finally {
      isClickingRef.current = false
      setIsClicking(false)
    }
  }

  function applyBalance(next: number) {
    setBalance(next)
    setError('')
  }

  return { balance, isLoading, isClicking, error, clickToEarn, applyBalance }
}
