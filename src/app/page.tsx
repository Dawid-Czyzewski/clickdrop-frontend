import type { Metadata } from 'next'
import { buildPageMetadata } from '../seo/site'
import { HomePage } from '../views/HomePage'

export const metadata: Metadata = buildPageMetadata('home')

export default function HomeRoute() {
  return <HomePage />
}
