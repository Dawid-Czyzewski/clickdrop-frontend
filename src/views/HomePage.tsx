'use client'

import { CasesShop } from '../components/cases/CasesShop'
import { EarnMoneyPanel } from '../components/home/EarnMoneyPanel'
import { AppShell } from '../components/home/AppShell'

export function HomePage() {
  return (
    <AppShell>
      <main className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="mb-8">
          <EarnMoneyPanel />
        </div>
        <CasesShop />
      </main>
    </AppShell>
  )
}
