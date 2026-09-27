'use client'

import { Suspense } from 'react'
import { AppShell } from '../components/home/AppShell'
import { SkinUpgradePanel } from '../components/skinUpgrade/SkinUpgradePanel'
import { CatalogSkeleton } from '../components/ui/Skeleton'
import { cdPagePad } from '../components/ui/uiStyles'

export function SkinUpgradePage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <Suspense
          fallback={
            <CatalogSkeleton
              count={6}
              colsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            />
          }
        >
          <SkinUpgradePanel />
        </Suspense>
      </main>
    </AppShell>
  )
}
