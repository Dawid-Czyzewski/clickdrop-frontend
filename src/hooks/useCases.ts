import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCases, type GameCase } from '../api/casesApi'
import { resolveCaseError } from '../api/resolveCaseError'
import { compareCasesByLevel } from '../lib/caseLevel'

type UseCasesOptions = {
  enabled?: boolean
}

export function useCases(options: UseCasesOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [cases, setCases] = useState<GameCase[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setCases([])
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getCases()
      .then((data) => {
        if (!cancelled) {
          setCases([...data].sort(compareCasesByLevel))
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCases([])
          setError(resolveCaseError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, t, reloadToken])

  return {
    cases,
    isLoading,
    error,
    refresh: () => setReloadToken((n) => n + 1),
  }
}
