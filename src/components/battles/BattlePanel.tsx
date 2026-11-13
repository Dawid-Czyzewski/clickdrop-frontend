'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useBattleFlow } from '../../hooks/useBattleFlow'
import { useCases } from '../../hooks/useCases'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { BattleResultBanner } from './BattleResultBanner'
import { BattleRoundPlay } from './BattleRoundPlay'
import { BattleSetupForm } from './BattleSetupForm'

export function BattlePanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const userId = authService.getAuthUser()?.id ?? null
  const { balance, applyBalance } = useBalance({ enabled: loggedIn })
  const { cases, isLoading: casesLoading, error: casesError } = useCases({
    enabled: loggedIn,
  })
  const flow = useBattleFlow({ onBalance: applyBalance })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('battles.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('battles.loginCta')}
        </Link>
      </div>
    )
  }

  const selectedCase = cases.find((c) => c.id === flow.caseId)
  const stake = flow.stakeFor(selectedCase)
  const error = casesError || flow.error

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={cdEyebrow}>{t('battles.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('battles.title')}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('battles.subtitle')}</p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {casesLoading ? (
        <CatalogSkeleton count={4} colsClassName="grid-cols-1 sm:grid-cols-2" />
      ) : null}

      {!casesLoading && flow.phase === 'setup' ? (
        <BattleSetupForm
          cases={cases}
          caseId={flow.caseId}
          rounds={flow.rounds}
          stake={stake}
          balance={balance}
          busy={false}
          onSelectCase={flow.selectCase}
          onSelectRounds={flow.selectRounds}
          onStart={() => {
            void flow.startVsBot()
          }}
        />
      ) : null}

      {flow.phase === 'creating' ? (
        <p className={cdBodyMuted} role="status">
          {t('battles.starting')}
        </p>
      ) : null}

      {(flow.phase === 'playing' || flow.phase === 'result') && flow.battle ? (
        <BattleRoundPlay
          rounds={flow.grouped}
          revealedRounds={
            flow.phase === 'result' ? flow.battle.rounds : flow.revealedRounds
          }
          totalRounds={flow.battle.rounds}
        />
      ) : null}

      {flow.phase === 'result' && flow.battle ? (
        <BattleResultBanner
          battle={flow.battle}
          userId={userId}
          onPlayAgain={flow.reset}
        />
      ) : null}
    </div>
  )
}
