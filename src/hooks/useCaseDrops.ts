'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCaseDrops, type CaseDrop } from '../api/casesApi'
import { resolveCaseError } from '../api/resolveCaseError'

type UseCaseDropsOptions = {
  caseId: number | null
  enabled?: boolean
}

export function useCaseDrops({ caseId, enabled = true }: UseCaseDropsOptions) {
  const { t } = useTranslation()
  const [drops, setDrops] = useState<CaseDrop[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(enabled && caseId))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled || caseId === null) {
      setDrops([])
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getCaseDrops(caseId)
      .then((data) => {
        if (!cancelled) setDrops(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setDrops([])
          setError(resolveCaseError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [caseId, enabled, t])

  return { drops, isLoading, error }
}
