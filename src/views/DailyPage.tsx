'use client'

import { AppShell } from '../components/home/AppShell'
import { DailyFreePanel } from '../components/daily/DailyFreePanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function DailyPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <DailyFreePanel />
      </main>
    </AppShell>
  )
}
