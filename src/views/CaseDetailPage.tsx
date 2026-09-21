'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useCases } from '../hooks/useCases'
import { AppShell } from '../components/home/AppShell'
import { CaseDetailPanel } from '../components/cases/CaseDetailPanel'

type CaseDetailPageProps = {
  caseId: number
}

export function CaseDetailPage({ caseId }: CaseDetailPageProps) {
  const { t } = useTranslation()
  const { cases, isLoading, error } = useCases({ enabled: true })
  const gameCase = cases.find((item) => item.id === caseId) ?? null

  return (
    <AppShell>
      <main className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        {isLoading ? (
          <p role="status" className="py-10 text-center text-sm text-cd-muted">
            {t('cases.loading')}
          </p>
        ) : error ? (
          <p role="alert" className="text-sm text-cd-danger">
            {error}
          </p>
        ) : !gameCase ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-cd-muted">{t('cases.errorNotFound')}</p>
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
