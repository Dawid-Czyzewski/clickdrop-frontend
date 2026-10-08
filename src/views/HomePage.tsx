'use client'

import { CasesShop } from '../components/cases/CasesShop'
import { EarnMoneyPanel } from '../components/home/EarnMoneyPanel'
import { AppShell } from '../components/home/AppShell'
import { RecentDropsFeed } from '../components/home/RecentDropsFeed'
import { cdPagePad } from '../components/ui/uiStyles'

export function HomePage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <div className="mb-6">
          <RecentDropsFeed />
        </div>
        <div className="mb-2">
          <EarnMoneyPanel />
        </div>
        <CasesShop />
      </main>
    </AppShell>
  )
}
