'use client'

import { AppShell } from '../components/home/AppShell'
import { UpgradeShop } from '../components/upgrades/UpgradeShop'
import { cdPagePad } from '../components/ui/uiStyles'

export function UpgradesPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <UpgradeShop />
      </main>
    </AppShell>
  )
}
