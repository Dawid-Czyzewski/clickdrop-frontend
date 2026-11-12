import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { TradeUpPage } from '../../views/TradeUpPage'

export const metadata: Metadata = buildPageMetadata('tradeUp')

export default function TradeUpRoute() {
  return <TradeUpPage />
}
