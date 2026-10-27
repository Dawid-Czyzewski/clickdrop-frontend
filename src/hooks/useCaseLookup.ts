import { useEffect, useState } from 'react'
import {
  fetchCaseLookup,
  type CaseLookup,
} from '../lib/recentDropCaseLookup'

let cached: Promise<CaseLookup> | null = null

function loadCaseLookup(): Promise<CaseLookup> {
  if (!cached) cached = fetchCaseLookup()
  return cached
}

export function resetCaseLookupCache(): void {
  cached = null
}

export function useCaseLookup(enabled = true) {
  const [lookup, setLookup] = useState<CaseLookup | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLookup(null)
      return
    }
    let cancelled = false
    loadCaseLookup()
      .then((data) => {
        if (!cancelled) setLookup(data)
      })
      .catch(() => {
        if (!cancelled) setLookup(null)
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return lookup
}
