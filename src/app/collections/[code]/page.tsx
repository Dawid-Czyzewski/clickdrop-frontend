import type { Metadata } from 'next'
import { buildPageMetadata } from '../../../seo/site'
import { CollectionDetailPage } from '../../../views/CollectionDetailPage'

type PageProps = {
  params: Promise<{ code: string }>
}

export const metadata: Metadata = buildPageMetadata('collections')

export default async function CollectionDetailRoute({ params }: PageProps) {
  const { code } = await params
  return <CollectionDetailPage code={decodeURIComponent(code)} />
}
