'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SkinUpgradePreview, SkinUpgradeTarget } from '../../api/skinUpgradeApi'
import { filterTargetsInPriceBand } from '../../lib/skinUpgradePricing'
import { cdBodyMuted, cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'
import { SkinUpgradeAnim } from './SkinUpgradeAnim'
import { SkinUpgradeSkinCard } from './SkinUpgradeSkinCard'

type SkinUpgradePreviewPanelProps = {
  preview: SkinUpgradePreview
  confirming: boolean
  busy: boolean
  spinning: boolean
  outcome?: 'SUCCESS' | 'FAIL'
  onBack: () => void
  onRequestUpgrade: () => void
  onConfirm: (choice: { targetItemId: number; targetExterior: SkinUpgradeTarget['exterior'] }) => void
  onCancelConfirm: () => void
  onAnimDone: () => void
}

function pickRandomIndex(length: number) {
  if (length <= 0) return 0
  return Math.floor(Math.random() * length)
}

export function SkinUpgradePreviewPanel({
  preview,
  confirming,
  busy,
  spinning,
  outcome,
  onBack,
  onRequestUpgrade,
  onConfirm,
  onCancelConfirm,
  onAnimDone,
}: SkinUpgradePreviewPanelProps) {
  const { t } = useTranslation()
  const { current, successChance, possibleTargets: rawTargets } = preview
  const possibleTargets = filterTargetsInPriceBand(
    current.suggestedSellPrice,
    rawTargets,
  )
  const winPct = Math.round(successChance * 100)
  const losePct = 100 - winPct
  const canUpgrade = possibleTargets.length > 0
  const locked = busy || spinning
  const [targetIndex, setTargetIndex] = useState(0)

  useEffect(() => {
    setTargetIndex(pickRandomIndex(possibleTargets.length))
  }, [preview.inventoryItemId, possibleTargets.length])

  const target = possibleTargets[targetIndex % Math.max(possibleTargets.length, 1)] ?? null

  function cycleTarget() {
    if (possibleTargets.length < 2) return
    setTargetIndex((i) => {
      let next = pickRandomIndex(possibleTargets.length)
      if (next === i % possibleTargets.length) {
        next = (i + 1) % possibleTargets.length
      }
      return next
    })
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <p className={`w-full text-center ${cdBodyMuted}`}>
        {t('skinUpgrade.riskCopy', { win: winPct, lose: losePct })}
      </p>

      <div className="flex w-full flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:gap-10">
        <div className="flex shrink-0 justify-center sm:justify-start">
          <SkinUpgradeSkinCard
            itemCode={current.itemCode}
            itemDisplayName={current.itemDisplayName}
            rarity={current.rarity}
            exterior={current.exterior}
            suggestedSellPrice={current.suggestedSellPrice}
            label={t('skinUpgrade.currentLabel')}
            size="lg"
          />
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-4">
          <SkinUpgradeAnim
            winPct={winPct}
            mode={spinning ? 'spinning' : 'idle'}
            outcome={outcome}
            onDone={onAnimDone}
          />

          {spinning ? null : confirming ? (
            <div
              className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-cd-danger/40 bg-cd-danger/10 p-4"
              role="alertdialog"
              aria-labelledby="upgrade-warn-title"
            >
              <p id="upgrade-warn-title" className="font-display text-sm font-semibold text-cd-text">
                {t('skinUpgrade.confirmTitle')}
              </p>
              <p className={cdBodyMuted}>{t('skinUpgrade.confirmBody')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  disabled={locked || !target}
                  onClick={() => {
                    if (!target) return
                    onConfirm({
                      targetItemId: target.itemId,
                      targetExterior: target.exterior,
                    })
                  }}
                  className={`${cdBtnPrimary} cursor-pointer`}
                >
                  {t('skinUpgrade.confirmCta')}
                </button>
                <button
                  type="button"
                  disabled={locked}
                  onClick={onCancelConfirm}
                  className={`${cdBtnGhost} cursor-pointer`}
                >
                  {t('skinUpgrade.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                disabled={locked || !canUpgrade}
                onClick={onRequestUpgrade}
                className={`${cdBtnPrimary} cursor-pointer`}
              >
                {t('skinUpgrade.upgradeFree')}
              </button>
              <button
                type="button"
                disabled={locked}
                onClick={onBack}
                className={`${cdBtnGhost} cursor-pointer`}
              >
                {t('skinUpgrade.back')}
              </button>
            </div>
          )}

          {!canUpgrade && !spinning ? (
            <p className={cdBodyMuted}>{t('skinUpgrade.noTargets')}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 sm:items-end">
          {target ? (
            <>
              <SkinUpgradeSkinCard
                itemCode={target.itemCode}
                itemDisplayName={target.itemDisplayName}
                rarity={target.rarity}
                exterior={target.exterior}
                suggestedSellPrice={target.suggestedSellPrice}
                label={t('skinUpgrade.targetsLabel')}
                accent
                size="lg"
              />
              {possibleTargets.length > 1 && !spinning ? (
                <button
                  type="button"
                  disabled={locked}
                  onClick={cycleTarget}
                  className={`${cdBtnGhost} cursor-pointer text-sm`}
                >
                  {t('skinUpgrade.refreshTarget')}
                </button>
              ) : null}
            </>
          ) : (
            <div className="w-[min(100%,20rem)]" />
          )}
        </div>
      </div>
    </div>
  )
}
