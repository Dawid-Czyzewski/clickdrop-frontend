'use client'

import { AppShell } from '../components/home/AppShell'
import { InventoryPanel } from '../components/inventory/InventoryPanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function InventoryPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <InventoryPanel />
      </main>
    </AppShell>
  )
}
