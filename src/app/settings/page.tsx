import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { SettingsPage } from '../../views/SettingsPage'

export const metadata: Metadata = buildPageMetadata('settings')

export default function SettingsRoute() {
  return <SettingsPage />
}
