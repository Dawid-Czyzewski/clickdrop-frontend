'use client'

import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { NavStatsBar } from './NavStatsBar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-cd-bg text-cd-text">
      <SiteHeader />
      <NavStatsBar />
      {children}
    </div>
  )
}
