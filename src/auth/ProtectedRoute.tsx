'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from './authService'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const ok = authService.hasActiveSession()
    setAllowed(ok)
    if (!ok) {
      router.replace('/login')
    }
  }, [router])

  if (allowed !== true) {
    return null
  }

  return children
}
