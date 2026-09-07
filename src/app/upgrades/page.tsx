import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { UpgradesPage } from '../../views/UpgradesPage'

export const metadata: Metadata = buildPageMetadata('upgrades')

export default function UpgradesRoute() {
  return <UpgradesPage />
}
