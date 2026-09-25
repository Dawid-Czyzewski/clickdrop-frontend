import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { DailyPage } from '../../views/DailyPage'

export const metadata: Metadata = buildPageMetadata('daily')

export default function DailyRoute() {
  return <DailyPage />
}
