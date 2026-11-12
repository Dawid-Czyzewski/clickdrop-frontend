import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { CollectionsPage } from '../../views/CollectionsPage'

export const metadata: Metadata = buildPageMetadata('collections')

export default function CollectionsRoute() {
  return <CollectionsPage />
}
