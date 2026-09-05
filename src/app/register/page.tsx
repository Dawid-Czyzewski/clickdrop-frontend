import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { RegisterPage } from '../../views/RegisterPage'

export const metadata: Metadata = buildPageMetadata('register')

export default function RegisterRoute() {
  return <RegisterPage />
}
