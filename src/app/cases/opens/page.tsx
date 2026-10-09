import type { Metadata } from 'next'
import { buildPageMetadata } from '../../../seo/site'
import { CaseOpenHistoryPage } from '../../../views/CaseOpenHistoryPage'

export const metadata: Metadata = buildPageMetadata('caseOpens')

export default function CaseOpensRoute() {
  return <CaseOpenHistoryPage />
}
