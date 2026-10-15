import type { Metadata } from 'next'
import { buildPageMetadata } from '../../seo/site'
import { ForgotPasswordPage } from '../../views/ForgotPasswordPage'

export const metadata: Metadata = buildPageMetadata('forgotPassword')

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />
}
