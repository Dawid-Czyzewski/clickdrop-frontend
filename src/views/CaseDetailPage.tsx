'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useCases } from '../hooks/useCases'
import { AppShell } from '../components/home/AppShell'
import { CaseDetailPanel } from '../components/cases/CaseDetailPanel'
import { CatalogSkeleton } from '../components/ui/Skeleton'
import { cdBodyMuted, cdPagePad } from '../components/ui/uiStyles'

type CaseDetailPageProps = {
  caseId: number
}

export function CaseDetailPage({ caseId }: CaseDetailPageProps) {
  const { t } = useTranslation()
  const { cases, isLoading, error } = useCases({ enabled: true })
  const gameCase = cases.find((item) => item.id === caseId) ?? null

  return (
    <AppShell>
      <main className={cdPagePad}>
        {isLoading ? (
          <div className="mx-auto max-w-md">
            <CatalogSkeleton count={1} colsClassName="grid-cols-1" />
          </div>
        ) : error ? (
          <p role="alert" className="text-sm text-cd-danger">
            {error}
          </p>
        ) : !gameCase ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className={cdBodyMuted}>{t('cases.errorNotFound')}</p>
            <Link
              href="/#cases"
              className="cursor-pointer text-sm text-cd-accent no-underline hover:text-cd-accent-hover"
            >
              ← {t('cases.back')}
            </Link>
          </div>
        ) : (
          <CaseDetailPanel gameCase={gameCase} />
        )}
      </main>
    </AppShell>
  )
}
