import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { BattlesPage } from '../../views/BattlesPage'

export const metadata: Metadata = buildPageMetadata('battles')

export default function BattlesRoute() {
  return <BattlesPage />
}
