'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useInventory } from '../../hooks/useInventory'
import { useSkinUpgradeFlow } from '../../hooks/useSkinUpgradeFlow'
import { CaseOpenResultModal } from '../cases/CaseOpenResultModal'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { SkinUpgradeAnim } from './SkinUpgradeAnim'
import { SkinUpgradeFailView } from './SkinUpgradeFailView'
import { SkinUpgradePreviewPanel } from './SkinUpgradePreviewPanel'
import { SkinUpgradeSelect } from './SkinUpgradeSelect'

export function SkinUpgradePanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { items, isLoading, error: invError } = useInventory({ enabled: loggedIn })
  const flow = useSkinUpgradeFlow(items, isLoading)

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('skinUpgrade.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('skinUpgrade.loginCta')}
        </Link>
      </div>
    )
  }

  const error = invError || flow.upgradeError
  const showSkeleton =
    isLoading || (flow.phase === 'preview' && flow.isLoadingPreview && !flow.preview)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={cdEyebrow}>{t('skinUpgrade.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('skinUpgrade.title')}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('skinUpgrade.subtitle')}</p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {showSkeleton ? (
        <CatalogSkeleton count={6} colsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4" />
      ) : null}

      {flow.phase === 'select' && !isLoading ? (
        <SkinUpgradeSelect
          items={items}
          selectedId={flow.selectedId}
          disabled={flow.busy}
          onSelect={(id) => {
            void flow.selectItem(id)
          }}
        />
      ) : null}

      {flow.phase === 'preview' && flow.preview ? (
        <SkinUpgradePreviewPanel
          preview={flow.preview}
          confirming={flow.confirming}
          busy={flow.busy}
          onBack={flow.resetToSelect}
          onRequestUpgrade={() => flow.setConfirming(true)}
          onConfirm={() => {
            void flow.confirmUpgrade()
          }}
          onCancelConfirm={() => flow.setConfirming(false)}
        />
      ) : null}

      {flow.phase === 'animating' && flow.outcome ? (
        <div className="flex justify-center py-10">
          <SkinUpgradeAnim outcome={flow.outcome.result} onDone={flow.finishAnim} />
        </div>
      ) : null}

      {flow.phase === 'fail' ? (
        <SkinUpgradeFailView
          onTryAgain={flow.resetToSelect}
          onInventory={flow.goInventory}
        />
      ) : null}

      {flow.successDrop ? (
        <CaseOpenResultModal
          drop={flow.successDrop}
          isSelling={flow.selling}
          onKeep={flow.keepSuccess}
          onSell={() => {
            void flow.sellSuccess()
          }}
          onClose={() => flow.resetToSelect()}
          backdropCodes={flow.backdropCodes}
        />
      ) : null}
    </div>
  )
}
