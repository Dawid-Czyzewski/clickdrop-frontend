'use client'

import { AppShell } from '../components/home/AppShell'
import { CaseOpenHistoryPanel } from '../components/cases/CaseOpenHistoryPanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function CaseOpenHistoryPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <CaseOpenHistoryPanel />
      </main>
    </AppShell>
  )
}
