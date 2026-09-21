import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { InventoryPage } from '../../views/InventoryPage'

export const metadata: Metadata = buildPageMetadata('inventory')

export default function InventoryRoute() {
  return <InventoryPage />
}
