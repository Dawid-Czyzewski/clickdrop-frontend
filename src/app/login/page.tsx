import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { LoginPage } from '../../views/LoginPage'

export const metadata: Metadata = buildPageMetadata('login')

export default function LoginRoute() {
  return <LoginPage />
}
