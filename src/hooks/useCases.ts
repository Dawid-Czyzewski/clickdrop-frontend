import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCases, type GameCase } from '../api/casesApi'
import { resolveCaseError } from '../api/resolveCaseError'

type UseCasesOptions = {
  enabled?: boolean
}

export function useCases(options: UseCasesOptions = {}) {
  const { enabled = true } = options
  const { t } = useTranslation()
  const [cases, setCases] = useState<GameCase[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

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
          setCases([...data].sort((a, b) => a.sortOrder - b.sortOrder))
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
  }, [enabled, t])

  return { cases, isLoading, error }
}
