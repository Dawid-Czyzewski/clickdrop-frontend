'use client'

import { useTranslation } from 'react-i18next'
import { cdBodyMuted, cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type SkinUpgradeFailViewProps = {
  onTryAgain: () => void
  onInventory: () => void
}

export function SkinUpgradeFailView({ onTryAgain, onInventory }: SkinUpgradeFailViewProps) {
  const { t } = useTranslation()

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="font-display text-2xl font-bold tracking-wide text-red-300 uppercase">
        {t('skinUpgrade.failTitle')}
      </p>
      <p className={`max-w-md ${cdBodyMuted}`}>{t('skinUpgrade.failBody')}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onTryAgain} className={`${cdBtnPrimary} cursor-pointer`}>
          {t('skinUpgrade.tryAgain')}
        </button>
        <button type="button" onClick={onInventory} className={`${cdBtnGhost} cursor-pointer`}>
          {t('skinUpgrade.toInventory')}
        </button>
      </div>
    </div>
  )
}
