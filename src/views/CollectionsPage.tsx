'use client'

import { AppShell } from '../components/home/AppShell'
import { CollectionsPanel } from '../components/collections/CollectionsPanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function CollectionsPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <CollectionsPanel />
      </main>
    </AppShell>
  )
}
