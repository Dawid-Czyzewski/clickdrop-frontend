'use client'

import { useTranslation } from 'react-i18next'
import type { MyUpgrade } from '../../api/economyApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { upgradeDescriptionKey, upgradeNameKey } from '../../lib/upgradeI18n'

type UpgradeCardProps = {
  upgrade: MyUpgrade
  balance: number | null
  isBuying: boolean
  disabled: boolean
  onBuy: (upgradeId: number) => void
}

export function UpgradeCard({
  upgrade,
  balance,
  isBuying,
  disabled,
  onBuy,
}: UpgradeCardProps) {
  const { t, i18n } = useTranslation()
  const cost = upgrade.nextCost
  const canAfford = balance !== null && balance >= cost
  const buyDisabled = disabled || isBuying || !canAfford

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-cd-border bg-cd-surface/70 p-4 text-left">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold tracking-wide text-cd-text">
          {t(upgradeNameKey(upgrade.code))}
        </h2>
        <p className="text-sm text-cd-muted">{t(upgradeDescriptionKey(upgrade.code))}</p>
      </div>

      <dl className="m-0 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-cd-muted">{t('upgrades.levelLabel')}</dt>
          <dd className="m-0 font-semibold text-cd-text">{t('upgrades.level', { level: upgrade.level })}</dd>
        </div>
        <div>
          <dt className="text-cd-muted">{t('upgrades.powerLabel')}</dt>
          <dd className="m-0 font-semibold text-[#7dffa0]">
            {t('upgrades.clickPower', { power: upgrade.clickPower })}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-cd-muted">{t('upgrades.nextCostLabel')}</dt>
          <dd className="m-0 font-semibold tabular-nums text-cd-accent">
            {formatClickDollars(cost, i18n.language)} CD
          </dd>
        </div>
      </dl>

      <button
        type="button"
        disabled={buyDisabled}
        aria-busy={isBuying || undefined}
        onClick={() => onBuy(upgrade.id)}
        className="cursor-pointer rounded-md bg-cd-accent px-4 py-2 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isBuying ? t('upgrades.buying') : t('upgrades.buy')}
      </button>

      {!canAfford && balance !== null ? (
        <p className="text-xs text-cd-danger">{t('upgrades.insufficientFunds')}</p>
      ) : null}
    </article>
  )
}
