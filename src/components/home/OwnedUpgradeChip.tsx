'use client'

import { useTranslation } from 'react-i18next'
import type { MyUpgrade } from '../../api/economyApi'
import { upgradeBonusPerClick } from '../../lib/clickReward'
import { upgradeNameKey } from '../../lib/upgradeI18n'

type OwnedUpgradeChipProps = {
  upgrade: MyUpgrade
}

export function OwnedUpgradeChip({ upgrade }: OwnedUpgradeChipProps) {
  const { t } = useTranslation()
  const bonus = upgradeBonusPerClick(upgrade)

  return (
    <div className="w-full max-w-[9.5rem] rounded-md border border-cd-border bg-cd-bg/70 px-3 py-2 text-left sm:max-w-[11rem]">
      <p className="truncate font-display text-xs font-semibold tracking-wide text-cd-text">
        {t(upgradeNameKey(upgrade.code))}
      </p>
      <p className="mt-1 text-[0.7rem] text-cd-muted">{t('upgrades.level', { level: upgrade.level })}</p>
      <p className="mt-0.5 text-[0.7rem] text-[#7dffa0]">
        {t('upgrades.clickPower', { power: bonus })}
      </p>
    </div>
  )
}
