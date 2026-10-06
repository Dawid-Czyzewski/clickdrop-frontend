'use client'

import { useTranslation } from 'react-i18next'
import type { MyUpgrade } from '../../api/economyApi'
import { upgradeBonusPerClick } from '../../lib/clickReward'
import { formatIncomeRate, upgradeIdleRate } from '../../lib/idleIncome'
import { upgradeNameKey } from '../../lib/upgradeI18n'

type OwnedUpgradeChipProps = {
  upgrade: MyUpgrade
}

export function OwnedUpgradeChip({ upgrade }: OwnedUpgradeChipProps) {
  const { t, i18n } = useTranslation()
  const clickBonus = upgradeBonusPerClick(upgrade)
  const idleRate = upgradeIdleRate(upgrade)
  const showIdle = idleRate > 0
  const showClick = !showIdle && clickBonus > 0

  return (
    <div className="w-full max-w-[9.5rem] rounded-md border border-cd-border bg-cd-bg/70 px-3 py-2 text-left sm:max-w-[11rem]">
      <p className="truncate font-display text-xs font-semibold tracking-wide text-cd-text">
        {t(upgradeNameKey(upgrade.code))}
      </p>
      <p className="mt-1 text-[0.7rem] text-cd-muted">{t('upgrades.level', { level: upgrade.level })}</p>
      {showIdle ? (
        <p className="mt-0.5 text-[0.7rem] text-[#7dffa0]">
          {t('upgrades.incomePerSecond', {
            amount: formatIncomeRate(idleRate, i18n.language),
          })}
        </p>
      ) : null}
      {showClick ? (
        <p className="mt-0.5 text-[0.7rem] text-[#7dffa0]">
          {t('upgrades.clickPower', { power: clickBonus })}
        </p>
      ) : null}
    </div>
  )
}
