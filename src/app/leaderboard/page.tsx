import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { LeaderboardPage } from '../../views/LeaderboardPage'

export const metadata: Metadata = buildPageMetadata('leaderboard')

export default function LeaderboardRoute() {
  return <LeaderboardPage />
}
