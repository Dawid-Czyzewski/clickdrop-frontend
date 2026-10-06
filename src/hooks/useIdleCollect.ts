import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  collectIdle as postCollectIdle,
  getIdleStatus,
  type IdleCollectResponse,
} from '../api/economyApi'
import { resolveEconomyError } from '../api/resolveEconomyError'
import { pendingIdleAmount } from '../lib/idleIncome'

type UseIdleCollectOptions = {
  enabled?: boolean
}

export function useIdleCollect(options: UseIdleCollectOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [pending, setPending] = useState(0)
  const [incomePerSecond, setIncomePerSecond] = useState(0)
  const [lastIdleCollectedAt, setLastIdleCollectedAt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isCollecting, setIsCollecting] = useState(false)
  const [error, setError] = useState('')
  const busyRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setPending(0)
      setIncomePerSecond(0)
      setLastIdleCollectedAt(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getIdleStatus()
      .then((data) => {
        if (cancelled) return
        setPending(data.pending)
        setIncomePerSecond(data.incomePerSecond)
        setLastIdleCollectedAt(data.lastIdleCollectedAt)
      })
      .catch((err) => {
        if (!cancelled) {
          setPending(0)
          setIncomePerSecond(0)
          setLastIdleCollectedAt(null)
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

  useEffect(() => {
    if (!enabled || !lastIdleCollectedAt || incomePerSecond <= 0) return

    const tick = () => {
      setPending(pendingIdleAmount(incomePerSecond, lastIdleCollectedAt))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [enabled, incomePerSecond, lastIdleCollectedAt])

  async function collectIdle(): Promise<IdleCollectResponse | null> {
    if (!enabled || busyRef.current) return null

    busyRef.current = true
    setIsCollecting(true)
    setError('')

    try {
      const result = await postCollectIdle()
      const nowIso = new Date().toISOString()
      setPending(0)
      setIncomePerSecond(result.incomePerSecond)
      setLastIdleCollectedAt(nowIso)
      return result
    } catch (err) {
      setError(resolveEconomyError(err, t))
      return null
    } finally {
      busyRef.current = false
      setIsCollecting(false)
    }
  }

  function clearError() {
    setError('')
  }

  return {
    pending,
    incomePerSecond,
    isLoading,
    collectIdle,
    isCollecting,
    error,
    clearError,
  }
}
