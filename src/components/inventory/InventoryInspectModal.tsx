'use client'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import {
  exteriorLabelKey,
  RARITY_COLOR,
  rarityLabelKey,
  resolveItemLabel,
} from '../../lib/caseI18n'
import { useModalA11y } from '../../hooks/useModalA11y'
import { AssetImage } from '../media/AssetImage'
import { ItemWearLine } from '../media/ItemWearLine'
import { StatTrackBadge } from '../media/StatTrackBadge'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type InventoryInspectModalProps = {
  item: InventoryItem
  isSelling: boolean
  onClose: () => void
  onSell: (inventoryItemId: number) => void
}

export function InventoryInspectModal({
  item,
  isSelling,
  onClose,
  onSell,
}: InventoryInspectModalProps) {
  const { t, i18n } = useTranslation()
  const handleClose = useCallback(() => onClose(), [onClose])
  const dialogRef = useModalA11y({ onClose: handleClose })
  const color = RARITY_COLOR[item.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, item.code, item.displayName)

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/75 px-3 py-4 outline-none sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-inspect-title"
      onClick={handleClose}
    >
      <div
        className="mb-[env(safe-area-inset-bottom,0px)] flex w-full max-w-md flex-col gap-4 rounded-xl border border-cd-border bg-cd-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <p className="font-display text-[0.65rem] tracking-[0.22em] text-cd-accent uppercase">
            {t('inventory.inspectEyebrow')}
          </p>
          <h2
            id="inventory-inspect-title"
            className="mt-1 font-display text-xl font-semibold text-cd-text"
          >
            {name}
          </h2>
          <p className="mt-1 text-sm" style={{ color }}>
            {t(rarityLabelKey(item.rarity))}
          </p>
          <p className="text-sm text-cd-muted">{t(exteriorLabelKey(item.exterior))}</p>
        </div>

        <div
          className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-lg bg-cd-bg/40 p-3"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${color}22, transparent 70%)`,
          }}
        >
          <AssetImage
            kind="item"
            code={item.code}
            alt={name}
            className="h-full w-full object-contain"
          />
          {item.statTrack ? (
            <div className="pointer-events-none absolute top-2 left-2 z-10">
              <StatTrackBadge />
            </div>
          ) : null}
        </div>

        <ItemWearLine
          floatValue={item.floatValue}
          paintSeed={item.paintSeed}
          layout="stack"
          className="rounded-lg border border-cd-border/60 bg-cd-bg/30 px-3 py-2.5"
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={handleClose} className={`${cdBtnGhost} min-h-11 flex-1`}>
            {t('inventory.inspectClose')}
          </button>
          <button
            type="button"
            disabled={isSelling}
            aria-busy={isSelling || undefined}
            onClick={() => onSell(item.inventoryItemId)}
            className={`${cdBtnPrimary} min-h-11 flex-1`}
          >
            {isSelling
              ? t('inventory.selling')
              : t('inventory.sell', {
                  amount: formatClickDollars(item.suggestedSellPrice, i18n.language),
                })}
          </button>
        </div>
      </div>
    </div>
  )
}
