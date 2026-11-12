'use client'

import { AppShell } from '../components/home/AppShell'
import { TradeUpPanel } from '../components/tradeUp/TradeUpPanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function TradeUpPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <TradeUpPanel />
      </main>
    </AppShell>
  )
}
