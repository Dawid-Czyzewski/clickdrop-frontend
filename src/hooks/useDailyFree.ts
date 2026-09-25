'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  claimDaily,
  getDailyDrops,
  getDailyStatus,
  isDailySkinClaim,
  type DailyClaimResponse,
  type DailyDrop,
  type DailyStatusResponse,
} from '../api/dailyApi'
import { sellInventoryItem } from '../api/casesApi'
import { resolveDailyError } from '../api/resolveDailyError'
import { msUntil } from '../lib/formatCountdown'

type UseDailyFreeOptions = {
  loggedIn?: boolean
}

export function useDailyFree(options: UseDailyFreeOptions = {}) {
  const { loggedIn = true } = options
  const { t } = useTranslation()
  const [drops, setDrops] = useState<DailyDrop[]>([])
  const [status, setStatus] = useState<DailyStatusResponse | null>(null)
  const [drop, setDrop] = useState<DailyClaimResponse | null>(null)
  const [isLoadingDrops, setIsLoadingDrops] = useState(true)
  const [isLoadingStatus, setIsLoadingStatus] = useState(loggedIn)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isSelling, setIsSelling] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const busyRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    setIsLoadingDrops(true)

    getDailyDrops()
      .then((data) => {
        if (!cancelled) setDrops(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setDrops([])
          setError(resolveDailyError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingDrops(false)
      })

    return () => {
      cancelled = true
    }
  }, [t])

  useEffect(() => {
    if (!loggedIn) {
      setStatus(null)
      setDrop(null)
      setIsLoadingStatus(false)
      busyRef.current = false
      return
    }

    let cancelled = false
    setIsLoadingStatus(true)

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
        if (!cancelled) setIsLoadingStatus(false)
      })

    return () => {
      cancelled = true
    }
  }, [loggedIn, t])

  const remainingMs = status && !status.available ? msUntil(status.nextClaimAt, now) : 0

  useEffect(() => {
    if (!loggedIn || !status || status.available || remainingMs <= 0) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [loggedIn, status, remainingMs])

  useEffect(() => {
    if (!loggedIn || !status || status.available || remainingMs > 0) return
    setStatus({ available: true, nextClaimAt: null })
  }, [loggedIn, status, remainingMs])

  async function claim(): Promise<DailyClaimResponse | null> {
    if (!loggedIn || busyRef.current || isClaiming) return null

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
    if (!drop || !isDailySkinClaim(drop) || busyRef.current) return null

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
    drops,
    status,
    drop,
    isLoadingDrops,
    isLoadingStatus,
    isLoading: isLoadingDrops || (loggedIn && isLoadingStatus),
    isClaiming,
    isSelling,
    error,
    remainingMs,
    canClaim: Boolean(loggedIn && status?.available && !isClaiming && !drop),
    claim,
    sellDrop,
    keepDrop,
    clearError: () => setError(''),
  }
}
