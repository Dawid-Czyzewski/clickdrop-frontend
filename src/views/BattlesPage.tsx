'use client'

import { AppShell } from '../components/home/AppShell'
import { BattlePanel } from '../components/battles/BattlePanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function BattlesPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <BattlePanel />
      </main>
    </AppShell>
  )
}
