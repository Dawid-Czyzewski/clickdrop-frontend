'use client'

import { AppShell } from '../components/home/AppShell'
import { LeaderboardPanel } from '../components/leaderboard/LeaderboardPanel'
import { cdPagePad } from '../components/ui/uiStyles'

export function LeaderboardPage() {
  return (
    <AppShell>
      <main className={cdPagePad}>
        <LeaderboardPanel />
      </main>
    </AppShell>
  )
}
