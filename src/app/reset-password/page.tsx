import type { Metadata } from 'next'
import { Suspense } from 'react'
import { buildPageMetadata } from '../../seo/site'
import { ResetPasswordPage } from '../../views/ResetPasswordPage'

export const metadata: Metadata = buildPageMetadata('resetPassword')

export default function ResetPasswordRoute() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  )
}
