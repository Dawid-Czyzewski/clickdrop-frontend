'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  claimCollection,
  getCollection,
  type CollectionClaimResponse,
  type CollectionDetail,
} from '../api/collectionsApi'
import { resolveCollectionError } from '../api/resolveCollectionError'

type UseCollectionDetailOptions = {
  code: string
  enabled?: boolean
}

export function useCollectionDetail({ code, enabled = true }: UseCollectionDetailOptions) {
  const { t } = useTranslation()
  const [detail, setDetail] = useState<CollectionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState('')
  const busyRef = useRef(false)

  useEffect(() => {
    if (!enabled || !code) {
      setDetail(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getCollection(code)
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setDetail(null)
          setError(resolveCollectionError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [code, enabled, t])

  async function claim(): Promise<CollectionClaimResponse | null> {
    if (!enabled || !code || busyRef.current) return null
    busyRef.current = true
    setIsClaiming(true)
    setError('')
    try {
      const result = await claimCollection(code)
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              rewardClaimed: true,
              completed: true,
            }
          : prev,
      )
      return result
    } catch (err) {
      setError(resolveCollectionError(err, t))
      return null
    } finally {
      busyRef.current = false
      setIsClaiming(false)
    }
  }

  return { detail, isLoading, isClaiming, error, claim, clearError: () => setError('') }
}
