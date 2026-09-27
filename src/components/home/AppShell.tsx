'use client'

import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { NavStatsBar } from './NavStatsBar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="cd-app-shell">
      <SiteHeader />
      <NavStatsBar />
      {children}
    </div>
  )
}
