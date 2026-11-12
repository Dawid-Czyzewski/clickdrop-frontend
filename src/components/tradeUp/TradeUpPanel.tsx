'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useInventory } from '../../hooks/useInventory'
import { useTradeUpFlow } from '../../hooks/useTradeUpFlow'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { TradeUpConfirmModal } from './TradeUpConfirmModal'
import { TradeUpPickCard } from './TradeUpPickCard'
import { TradeUpRarityFilter } from './TradeUpRarityFilter'
import { TradeUpResultModal } from './TradeUpResultModal'
import { TradeUpRulesPreview } from './TradeUpRulesPreview'

export function TradeUpPanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { items, isLoading, error: invError, refresh } = useInventory({ enabled: loggedIn })
  const flow = useTradeUpFlow(items, { refreshInventory: refresh })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('tradeUp.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('tradeUp.loginCta')}
        </Link>
      </div>
    )
  }

  const error = invError || flow.error
  const pickDisabled = flow.busy || flow.phase === 'result'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={cdEyebrow}>{t('tradeUp.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('tradeUp.title')}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('tradeUp.subtitle')}</p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <CatalogSkeleton
          count={8}
          colsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className={cdBodyMuted}>{t('tradeUp.empty')}</p>
          <Link href="/#cases" className={cdBtnPrimaryLink}>
            {t('tradeUp.emptyCta')}
          </Link>
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <>
          <TradeUpRulesPreview
            selectedItems={flow.selectedItems}
            ready={flow.ready}
            busy={flow.busy}
            onClear={flow.clearSelection}
            onConfirm={flow.requestConfirm}
          />

          <TradeUpRarityFilter
            value={flow.rarityFilter}
            onChange={flow.setRarityFilter}
            disabled={pickDisabled}
          />

          {flow.visibleItems.length === 0 ? (
            <p className={cdBodyMuted}>{t('tradeUp.filtersEmpty')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {flow.visibleItems.map((item) => (
                <TradeUpPickCard
                  key={item.inventoryItemId}
                  item={item}
                  selected={flow.selectedIds.includes(item.inventoryItemId)}
                  disabled={
                    pickDisabled ||
                    (!flow.selectedIds.includes(item.inventoryItemId) &&
                      flow.selectedIds.length >= 10)
                  }
                  onToggle={flow.toggleSelect}
                />
              ))}
            </div>
          )}
        </>
      ) : null}

      {flow.phase === 'confirm' || flow.phase === 'submitting' ? (
        <TradeUpConfirmModal
          selectedItems={flow.selectedItems}
          isSubmitting={flow.busy}
          onCancel={flow.cancelConfirm}
          onConfirm={() => {
            void flow.confirmTradeUp()
          }}
        />
      ) : null}

      {flow.phase === 'result' && flow.result ? (
        <TradeUpResultModal result={flow.result} onClose={flow.dismissResult} />
      ) : null}
    </div>
  )
}
