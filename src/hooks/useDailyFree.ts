'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  claimDaily,
  getDailyStatus,
  type DailyClaimResponse,
  type DailyStatusResponse,
} from '../api/dailyApi'
import { sellInventoryItem } from '../api/casesApi'
import { resolveDailyError } from '../api/resolveDailyError'
import { msUntil } from '../lib/formatCountdown'

type UseDailyFreeOptions = {
  enabled?: boolean
}

export function useDailyFree(options: UseDailyFreeOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [status, setStatus] = useState<DailyStatusResponse | null>(null)
  const [drop, setDrop] = useState<DailyClaimResponse | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isSelling, setIsSelling] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const busyRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setStatus(null)
      setDrop(null)
      setError('')
      setIsLoading(false)
      busyRef.current = false
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getDailyStatus()
      .then((data) => {
        if (!cancelled) setStatus(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus(null)
          setError(resolveDailyError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  const remainingMs = status && !status.available ? msUntil(status.nextClaimAt, now) : 0

  useEffect(() => {
    if (!enabled || !status || status.available || remainingMs <= 0) return

    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [enabled, status, remainingMs])

  useEffect(() => {
    if (!enabled || !status || status.available || remainingMs > 0) return
    setStatus({ available: true, nextClaimAt: null })
  }, [enabled, status, remainingMs])

  async function claim(): Promise<DailyClaimResponse | null> {
    if (!enabled || busyRef.current || isClaiming) return null

    busyRef.current = true
    setIsClaiming(true)
    setError('')

    try {
      const result = await claimDaily()
      setDrop(result)
      setStatus({ available: false, nextClaimAt: result.nextClaimAt })
      return result
    } catch (err) {
      setError(resolveDailyError(err, t))
      return null
    } finally {
      busyRef.current = false
      setIsClaiming(false)
    }
  }

  async function sellDrop(): Promise<number | null> {
    if (!drop || busyRef.current) return null

    busyRef.current = true
    setIsSelling(true)
    setError('')

    try {
      const result = await sellInventoryItem(drop.inventoryItemId)
      setDrop(null)
      return result.balance
    } catch (err) {
      setError(resolveDailyError(err, t))
      return null
    } finally {
      busyRef.current = false
      setIsSelling(false)
    }
  }

  function keepDrop() {
    setDrop(null)
  }

  return {
    status,
    drop,
    isLoading,
    isClaiming,
    isSelling,
    error,
    remainingMs,
    canClaim: Boolean(enabled && status?.available && !isClaiming && !drop),
    claim,
    sellDrop,
    keepDrop,
    clearError: () => setError(''),
  }
}
