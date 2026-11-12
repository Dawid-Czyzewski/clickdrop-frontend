'use client'

import { AppShell } from '../components/home/AppShell'
import { CollectionDetailPanel } from '../components/collections/CollectionDetailPanel'
import { cdPagePad } from '../components/ui/uiStyles'

type CollectionDetailPageProps = {
  code: string
}

export function CollectionDetailPage({ code }: CollectionDetailPageProps) {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <CollectionDetailPanel code={code} />
      </main>
    </AppShell>
  )
}
