import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getMyCaseOpens, type CaseOpenHistoryItem } from '../api/casesApi'
import { resolveCaseError } from '../api/resolveCaseError'

type UseCaseOpenHistoryOptions = {
  enabled?: boolean
  limit?: number
}

export function useCaseOpenHistory(options: UseCaseOpenHistoryOptions = {}) {
  const { enabled = true, limit = 20 } = options
  const { t } = useTranslation()
  const [opens, setOpens] = useState<CaseOpenHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setOpens([])
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError('')

    getMyCaseOpens(limit)
      .then((data) => {
        if (!cancelled) setOpens(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setOpens([])
          setError(resolveCaseError(err, t))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, limit, t])

  return { opens, isLoading, error }
}
