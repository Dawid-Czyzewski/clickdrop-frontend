'use client'

import { useTranslation } from 'react-i18next'
import type { SkinUpgradePreview } from '../../api/skinUpgradeApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import {
  exteriorLabelKey,
  itemNameKey,
  RARITY_COLOR,
  rarityLabelKey,
} from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import {
  cdBodyMuted,
  cdBtnGhost,
  cdBtnPrimary,
  cdSectionLabel,
} from '../ui/uiStyles'

type SkinUpgradePreviewPanelProps = {
  preview: SkinUpgradePreview
  confirming: boolean
  busy: boolean
  onBack: () => void
  onRequestUpgrade: () => void
  onConfirm: () => void
  onCancelConfirm: () => void
}

export function SkinUpgradePreviewPanel({
  preview,
  confirming,
  busy,
  onBack,
  onRequestUpgrade,
  onConfirm,
  onCancelConfirm,
}: SkinUpgradePreviewPanelProps) {
  const { t, i18n } = useTranslation()
  const { current, successChance, possibleTargets } = preview
  const color = RARITY_COLOR[current.rarity] ?? '#8b92a5'
  const name = t(itemNameKey(current.itemCode))
  const winPct = Math.round(successChance * 100)
  const losePct = 100 - winPct
  const canUpgrade = possibleTargets.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
        <div
          className="flex aspect-[5/4] w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl border border-cd-border bg-cd-bg/70 p-3"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${color}28, transparent 70%)`,
          }}
        >
          <AssetImage
            kind="item"
            code={current.itemCode}
            alt={name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
          <p className="text-xs font-medium tracking-wide uppercase" style={{ color }}>
            {t(rarityLabelKey(current.rarity))}
          </p>
          <h2 className="font-display text-xl font-semibold text-cd-text">{name}</h2>
          <p className="text-sm text-cd-muted">{t(exteriorLabelKey(current.exterior))}</p>
          <p className="font-display text-sm text-cd-accent">
            {formatClickDollars(current.suggestedSellPrice, i18n.language)} CD
          </p>
          <p className={`mt-2 ${cdBodyMuted}`}>
            {t('skinUpgrade.riskCopy', { win: winPct, lose: losePct })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className={cdSectionLabel}>{t('skinUpgrade.targetsLabel')}</p>
        {!canUpgrade ? (
          <p className={cdBodyMuted}>{t('skinUpgrade.noTargets')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {possibleTargets.map((target) => {
              const tColor = RARITY_COLOR[target.rarity] ?? '#8b92a5'
              const tName = t(itemNameKey(target.itemCode))
              return (
                <div
                  key={target.itemId}
                  className="overflow-hidden rounded-lg border border-cd-border bg-cd-surface/60"
                >
                  <div className="h-0.5 w-full" style={{ backgroundColor: tColor }} />
                  <div className="flex aspect-[5/4] items-center justify-center p-1.5">
                    <AssetImage
                      kind="item"
                      code={target.itemCode}
                      alt={tName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="px-2 pb-2">
                    <p className="truncate text-xs font-semibold text-cd-text">{tName}</p>
                    <p className="text-[0.65rem] text-cd-muted">
                      {formatClickDollars(target.suggestedSellPrice, i18n.language)} CD
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {confirming ? (
        <div
          className="flex flex-col gap-3 rounded-lg border border-cd-danger/40 bg-cd-danger/10 p-4"
          role="alertdialog"
          aria-labelledby="upgrade-warn-title"
        >
          <p id="upgrade-warn-title" className="font-display text-sm font-semibold text-cd-text">
            {t('skinUpgrade.confirmTitle')}
          </p>
          <p className={cdBodyMuted}>{t('skinUpgrade.confirmBody')}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onConfirm}
              className={`${cdBtnPrimary} cursor-pointer`}
            >
              {t('skinUpgrade.confirmCta')}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onCancelConfirm}
              className={`${cdBtnGhost} cursor-pointer`}
            >
              {t('skinUpgrade.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy || !canUpgrade}
            onClick={onRequestUpgrade}
            className={`${cdBtnPrimary} cursor-pointer`}
          >
            {t('skinUpgrade.upgradeFree')}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onBack}
            className={`${cdBtnGhost} cursor-pointer`}
          >
            {t('skinUpgrade.back')}
          </button>
        </div>
      )}
    </div>
  )
}
