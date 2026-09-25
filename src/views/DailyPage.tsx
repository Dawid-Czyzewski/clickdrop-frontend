'use client'

import { AppShell } from '../components/home/AppShell'
import { DailyFreePanel } from '../components/daily/DailyFreePanel'

export function DailyPage() {
  return (
    <AppShell>
      <main className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <DailyFreePanel />
      </main>
    </AppShell>
  )
}
