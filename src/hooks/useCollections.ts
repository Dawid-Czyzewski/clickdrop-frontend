'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getCollections,
  type CollectionProgress,
} from '../api/collectionsApi'
import { resolveCollectionError } from '../api/resolveCollectionError'

type UseCollectionsOptions = {
  enabled?: boolean
}

export function useCollections(options: UseCollectionsOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [collections, setCollections] = useState<CollectionProgress[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setCollections([])
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getCollections()
      .then((data) => {
        if (!cancelled) setCollections(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setCollections([])
          setError(resolveCollectionError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t])

  return { collections, isLoading, error }
}
