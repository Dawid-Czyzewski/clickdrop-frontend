import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clickToEarn as postClickToEarn, getBalance } from '../api/economyApi'
import { resolveEconomyError } from '../api/resolveEconomyError'
import {
  getSharedBalance,
  setSharedBalance,
  subscribeSharedBalance,
} from '../lib/balanceStore'

type UseBalanceOptions = {
  enabled?: boolean
}

export function useBalance(options: UseBalanceOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [balance, setBalance] = useState<number | null>(() =>
    enabled ? getSharedBalance() : null,
  )
  const [isLoading, setIsLoading] = useState(enabled && getSharedBalance() === null)
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

    return subscribeSharedBalance((next) => {
      setBalance(next)
    })
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const cached = getSharedBalance()
    if (cached !== null) {
      setBalance(cached)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
    setError('')

    getBalance()
      .then((data) => {
        if (!cancelled) setSharedBalance(data.balance)
      })
      .catch((err) => {
        if (!cancelled) {
          setSharedBalance(null)
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
      setSharedBalance(result.balance)
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
    setSharedBalance(next)
    setError('')
  }

  return { balance, isLoading, isClicking, error, clickToEarn, applyBalance }
}
