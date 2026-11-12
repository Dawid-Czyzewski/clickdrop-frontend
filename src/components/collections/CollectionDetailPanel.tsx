'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useCollectionDetail } from '../../hooks/useCollectionDetail'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { RARITY_COLOR, rarityLabelKey, resolveCaseLabel, resolveItemLabel } from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnGhost,
  cdBtnPrimary,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'

type CollectionDetailPanelProps = {
  code: string
}

export function CollectionDetailPanel({ code }: CollectionDetailPanelProps) {
  const { t, i18n } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { applyBalance } = useBalance({ enabled: loggedIn })
  const { detail, isLoading, isClaiming, error, claim } = useCollectionDetail({
    code,
    enabled: loggedIn,
  })
  const [toast, setToast] = useState('')

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('collections.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('collections.loginCta')}
        </Link>
      </div>
    )
  }

  async function handleClaim() {
    const result = await claim()
    if (!result) return
    applyBalance(result.balance)
    setToast(
      t('collections.claimSuccess', {
        amount: formatClickDollars(result.rewardCd, i18n.language),
      }),
    )
  }

  const name = detail
    ? resolveCaseLabel(t, detail.code, detail.displayName)
    : code

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={cdEyebrow}>{t('collections.eyebrow')}</p>
        <h1 className={cdPageTitle}>{name}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('collections.detailSubtitle')}</p>
      </div>

      <Link href="/collections" className={`${cdBtnGhost} w-fit min-h-11 px-4 no-underline`}>
        {t('collections.back')}
      </Link>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}
      {toast ? (
        <p role="status" className="text-sm text-cd-accent">
          {toast}
        </p>
      ) : null}

      {isLoading || !detail ? (
        <CatalogSkeleton count={8} colsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4" />
      ) : (
        <>
          <section className="flex flex-col gap-3 rounded-lg border border-cd-border bg-cd-surface/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-cd-muted">
                {t('collections.progress', { owned: detail.owned, total: detail.total })}
              </p>
              <p className="mt-1 font-display text-cd-accent">
                {formatClickDollars(detail.rewardCd, i18n.language)} CD
              </p>
            </div>
            <button
              type="button"
              disabled={!detail.completed || detail.rewardClaimed || isClaiming}
              aria-busy={isClaiming || undefined}
              onClick={() => {
                void handleClaim()
              }}
              className={`${cdBtnPrimary} min-h-11 px-4`}
            >
              {detail.rewardClaimed
                ? t('collections.claimed')
                : isClaiming
                  ? t('collections.claiming')
                  : t('collections.claimCta')}
            </button>
          </section>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {detail.items.map((item) => {
              const color = RARITY_COLOR[item.rarity] ?? '#8b92a5'
              const itemName = resolveItemLabel(t, item.code, item.displayName)
              return (
                <article
                  key={item.itemId}
                  className={[
                    'flex flex-col overflow-hidden rounded-lg border bg-cd-surface/80',
                    item.owned ? 'border-cd-accent/50' : 'border-cd-border opacity-70',
                  ].join(' ')}
                >
                  <div className="h-0.5 w-full" style={{ backgroundColor: color }} />
                  <div className="flex flex-col gap-2 p-2.5">
                    <div
                      className="flex aspect-[5/4] items-center justify-center rounded-md bg-cd-bg/40 p-1"
                      style={{
                        background: `radial-gradient(circle at 50% 40%, ${color}22, transparent 70%)`,
                      }}
                    >
                      <AssetImage
                        kind="item"
                        code={item.code}
                        alt={itemName}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="text-center text-[0.6rem] uppercase" style={{ color }}>
                      {t(rarityLabelKey(item.rarity))}
                    </p>
                    <p className="truncate text-center font-display text-sm text-cd-text">
                      {itemName}
                    </p>
                    <p className="text-center text-xs text-cd-muted">
                      {item.owned ? t('collections.itemOwned') : t('collections.itemMissing')}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
