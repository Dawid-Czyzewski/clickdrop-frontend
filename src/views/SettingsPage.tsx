'use client'

import { AppShell } from '../components/home/AppShell'
import { SettingsPanel } from '../components/settings/SettingsPanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function SettingsPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <SettingsPanel />
      </main>
    </AppShell>
  )
}
