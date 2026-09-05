import type { Metadata } from 'next'
import { ProtectedRoute } from '../../auth/ProtectedRoute'
import { buildPageMetadata } from '../../seo/site'
import { DashboardPage } from '../../views/DashboardPage'

export const metadata: Metadata = buildPageMetadata('dashboard')

export default function DashboardRoute() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}
