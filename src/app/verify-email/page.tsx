import type { Metadata } from 'next'
import { Suspense } from 'react'
import { buildPageMetadata } from '../../seo/site'
import { VerifyEmailPage } from '../../views/VerifyEmailPage'

export const metadata: Metadata = buildPageMetadata('verifyEmail')

export default function VerifyEmailRoute() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  )
}
