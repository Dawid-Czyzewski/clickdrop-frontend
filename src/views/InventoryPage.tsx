'use client'

import { AppShell } from '../components/home/AppShell'
import { InventoryPanel } from '../components/inventory/InventoryPanel'

export function InventoryPage() {
  return (
    <AppShell>
      <main className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <InventoryPanel />
      </main>
    </AppShell>
  )
}
