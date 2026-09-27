import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { SkinUpgradePage } from '../../views/SkinUpgradePage'

export const metadata: Metadata = buildPageMetadata('skinUpgrade')

export default function SkinUpgradeRoute() {
  return <SkinUpgradePage />
}
