'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameCase, OpenCaseResponse } from '../../api/casesApi'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useCaseDrops } from '../../hooks/useCaseDrops'
import { useInventory } from '../../hooks/useInventory'
import { CASE_ACCENT, caseNameKey } from '../../lib/caseI18n'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { AssetImage } from '../media/AssetImage'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryBlock,
  cdBtnPrimaryLink,
  cdHeroFrame,
  cdMoney,
  cdPageTitle,
  cdSectionLabel,
} from '../ui/uiStyles'
import { CaseDropsGrid } from './CaseDropsGrid'
import { CaseOpenResultModal } from './CaseOpenResultModal'
import { CaseOpenSpinner } from './CaseOpenSpinner'

type CaseDetailPanelProps = {
  gameCase: GameCase
}

export function CaseDetailPanel({ gameCase }: CaseDetailPanelProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [drop, setDrop] = useState<OpenCaseResponse | null>(null)
  const [spinning, setSpinning] = useState(false)
  const { drops, isLoading: dropsLoading, error: dropsError } = useCaseDrops({
    caseId: gameCase.id,
  })
  const { balance, isLoading: balanceLoading, applyBalance } = useBalance({
    enabled: loggedIn,
  })
  const { openingCaseId, sellingId, error, openCase, sellItem, clearError } = useInventory({
    enabled: loggedIn,
  })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  const accent = CASE_ACCENT[gameCase.code] ?? '#f59e0b'
  const canAfford = balance !== null && balance >= gameCase.price
  const isOpening = openingCaseId === gameCase.id || spinning
  const openDisabled =
    !loggedIn || isOpening || drop !== null || !canAfford || balanceLoading

  async function handleOpen() {
    clearError()
    const result = await openCase(gameCase.id)
    if (!result) return
    applyBalance(result.balance)
    setDrop(result)
    const skipSpin = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setSpinning(!skipSpin)
  }

  async function handleSellNow() {
    if (!drop) return
    const result = await sellItem(drop.inventoryItemId)
    if (!result) return
    applyBalance(result.balance)
    setDrop(null)
  }

  function handleKeep() {
    setDrop(null)
    router.push('/inventory')
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/#cases"
        className="w-fit cursor-pointer text-sm text-cd-muted no-underline transition hover:text-cd-text"
      >
        ← {t('cases.back')}
      </Link>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <div
            className={cdHeroFrame}
            style={{
              background: `radial-gradient(circle at 50% 40%, ${accent}20, transparent 65%)`,
            }}
          >
            <AssetImage
              kind="case"
              code={gameCase.code}
              alt={t(caseNameKey(gameCase.code))}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className={`${cdPageTitle} text-center`}>{t(caseNameKey(gameCase.code))}</h1>
          <p className={cdMoney}>{formatClickDollars(gameCase.price, i18n.language)} CD</p>

          {loggedIn ? (
            <button
              type="button"
              disabled={openDisabled}
              aria-busy={isOpening || undefined}
              onClick={() => {
                void handleOpen()
              }}
              className={cdBtnPrimaryBlock}
            >
              {isOpening ? t('cases.opening') : t('cases.open')}
            </button>
          ) : (
            <Link href="/login" className={`${cdBtnPrimaryLink} w-full`}>
              {t('cases.loginCta')}
            </Link>
          )}

          {!canAfford && loggedIn && balance !== null ? (
            <p className="text-sm text-cd-danger">{t('cases.insufficientFunds')}</p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-cd-danger">
              {error}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className={cdSectionLabel}>{t('cases.dropsHeading')}</h2>
          <p className={`mt-1 mb-4 ${cdBodyMuted}`}>{t('cases.dropsSubtitle')}</p>
          {dropsLoading ? (
            <CatalogSkeleton count={4} colsClassName="grid-cols-2 sm:grid-cols-3" />
          ) : dropsError ? (
            <p role="alert" className="text-sm text-cd-danger">
              {dropsError}
            </p>
          ) : (
            <CaseDropsGrid drops={drops} />
          )}
        </div>
      </div>

      {spinning && drop ? (
        <CaseOpenSpinner
          drops={drops}
          winnerCode={drop.itemCode}
          onComplete={() => setSpinning(false)}
        />
      ) : null}

      {!spinning && drop ? (
        <CaseOpenResultModal
          drop={drop}
          isSelling={sellingId === drop.inventoryItemId}
          onClose={() => setDrop(null)}
          onKeep={handleKeep}
          onSell={() => {
            void handleSellNow()
          }}
          backdropCodes={drops.map((d) => d.code)}
        />
      ) : null}
    </div>
  )
}
