'use client'

import { AppShell } from '../components/home/AppShell'
import { UpgradeShop } from '../components/upgrades/UpgradeShop'

export function UpgradesPage() {
  return (
    <AppShell>
      <main className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <UpgradeShop />
      </main>
    </AppShell>
  )
}
