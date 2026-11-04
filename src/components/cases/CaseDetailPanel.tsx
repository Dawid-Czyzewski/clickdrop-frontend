'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameCase, OpenCasesResponse } from '../../api/casesApi'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useCaseDrops } from '../../hooks/useCaseDrops'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useDeferredLevelUpModal } from '../../hooks/useDeferredLevelUpModal'
import { useInventory } from '../../hooks/useInventory'
import { useSoldToast } from '../../hooks/useSoldToast'
import { shouldSkipCaseSpin } from '../../lib/caseAnimationPreference'
import { caseMinLevel, isCaseLevelLocked } from '../../lib/caseLevel'
import {
  clampOpenCount,
  isOpenCountLocked,
  type CaseOpenCount,
} from '../../lib/caseOpenCount'
import { CatalogSkeleton } from '../ui/Skeleton'
import { cdBodyMuted, cdSectionLabel } from '../ui/uiStyles'
import { CaseDetailOverlays } from './CaseDetailOverlays'
import { CaseDropsGrid } from './CaseDropsGrid'
import { CaseOpenHero } from './CaseOpenHero'
import { CaseOpenResultLayer } from './CaseOpenResultLayer'

type CaseDetailPanelProps = {
  gameCase: GameCase
}

export function CaseDetailPanel({ gameCase }: CaseDetailPanelProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [openCount, setOpenCount] = useState<CaseOpenCount>(1)
  const [openResult, setOpenResult] = useState<OpenCasesResponse | null>(null)
  const [spinning, setSpinning] = useState(false)
  const { levelUpLevel, queueLevelUp, revealLevelUpAfterDrop, closeLevelUp } =
    useDeferredLevelUpModal()
  const { drops, isLoading: dropsLoading, error: dropsError } = useCaseDrops({
    caseId: gameCase.id,
  })
  const { balance, isLoading: balanceLoading, applyBalance } = useBalance({
    enabled: loggedIn,
  })
  const { user, applyLevelExperience } = useCurrentUser({ enabled: loggedIn })
  const {
    openingCaseId,
    sellingId,
    isSellingBatch,
    error,
    openCase,
    sellItem,
    sellBatch,
    clearError,
  } = useInventory({ enabled: loggedIn })
  const { soldToast, showSoldToast, dismissSoldToast } = useSoldToast()

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  const userLevel = user?.level
  useEffect(() => {
    setOpenCount((current) => clampOpenCount(gameCase, current, userLevel))
  }, [gameCase, userLevel])

  const totalCost = gameCase.price * openCount
  const canAfford = balance !== null && balance >= totalCost
  const levelLocked =
    loggedIn &&
    (user != null
      ? isCaseLevelLocked(gameCase, user.level)
      : caseMinLevel(gameCase) > 1)
  const countLocked =
    loggedIn && isOpenCountLocked(gameCase, openCount, userLevel)
  const isOpening = openingCaseId === gameCase.id || spinning
  const resultOpen = openResult !== null
  const openDisabled =
    !loggedIn ||
    isOpening ||
    resultOpen ||
    !canAfford ||
    balanceLoading ||
    levelLocked ||
    countLocked
  const singleDrop = openResult?.count === 1 ? openResult.drops[0] : null
  const multiDrops = openResult && openResult.count > 1 ? openResult.drops : null

  function dismissResult(options?: { thenInventory?: boolean }) {
    setOpenResult(null)
    if (revealLevelUpAfterDrop(options)) router.push('/inventory')
  }

  async function handleOpen() {
    clearError()
    const result = await openCase(gameCase.id, openCount)
    if (!result) return
    const previousLevel = user?.level
    applyBalance(result.balance)
    applyLevelExperience(
      { level: result.level, experience: result.experience },
      { emitLevelUp: false },
    )
    if (result.level != null && previousLevel != null && result.level > previousLevel) {
      queueLevelUp(result.level)
    }
    setOpenResult(result)
    setSpinning(!shouldSkipCaseSpin())
  }

  async function handleSellNow() {
    if (!singleDrop) return
    const result = await sellItem(singleDrop.inventoryItemId)
    if (!result) return
    applyBalance(result.balance)
    showSoldToast(result.soldFor)
    dismissResult()
  }

  async function handleSellAll() {
    if (!multiDrops) return
    const result = await sellBatch(multiDrops.map((drop) => drop.inventoryItemId))
    if (!result) return
    applyBalance(result.balance)
    showSoldToast(result.totalEarned)
    dismissResult()
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
        <CaseOpenHero
          gameCase={gameCase}
          loggedIn={loggedIn}
          openCount={openCount}
          userLevel={userLevel}
          totalCost={totalCost}
          canAfford={canAfford}
          levelLocked={levelLocked}
          balance={balance}
          isOpening={isOpening}
          openDisabled={openDisabled}
          resultOpen={resultOpen}
          error={error}
          onCountChange={setOpenCount}
          onOpen={() => void handleOpen()}
        />

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

      <CaseOpenResultLayer
        drops={drops}
        openResult={openResult}
        spinning={spinning}
        singleDrop={singleDrop}
        multiDrops={multiDrops}
        sellingId={sellingId}
        isSellingBatch={isSellingBatch}
        onSpinComplete={() => setSpinning(false)}
        onDismiss={dismissResult}
        onSellNow={() => void handleSellNow()}
        onSellAll={() => void handleSellAll()}
      />

      <CaseDetailOverlays
        levelUpLevel={levelUpLevel}
        soldToast={soldToast}
        onCloseLevelUp={() => closeLevelUp(() => router.push('/inventory'))}
        onDismissSoldToast={dismissSoldToast}
      />
    </div>
  )
}
