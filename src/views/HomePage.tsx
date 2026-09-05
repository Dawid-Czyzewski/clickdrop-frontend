'use client'

import { CaseGrid } from '../components/home/CaseGrid'
import { EarnMoneyPanel } from '../components/home/EarnMoneyPanel'
import { LiveFeed } from '../components/home/LiveFeed'
import { MainNav } from '../components/home/MainNav'
import { SiteHeader } from '../components/home/SiteHeader'
import { StatsBar } from '../components/home/StatsBar'

export function HomePage() {
  return (
    <div className="min-h-svh bg-cd-bg text-cd-text">
      <SiteHeader />
      <MainNav />
      <StatsBar />

      <div className="flex w-full">
        <LiveFeed />
        <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
          <div className="mb-8">
            <EarnMoneyPanel />
          </div>
          <CaseGrid />
        </main>
      </div>
    </div>
  )
}
