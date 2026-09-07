'use client'

import { useTranslation } from 'react-i18next'
import type { MyUpgrade } from '../../api/economyApi'
import { OwnedUpgradeChip } from './OwnedUpgradeChip'

type OwnedUpgradesFlankProps = {
  upgrades: MyUpgrade[]
  side: 'left' | 'right'
}

export function OwnedUpgradesFlank({ upgrades, side }: OwnedUpgradesFlankProps) {
  const { t } = useTranslation()
  const owned = upgrades.filter((item) => item.level > 0)
  const midpoint = Math.ceil(owned.length / 2)
  const visible = side === 'left' ? owned.slice(0, midpoint) : owned.slice(midpoint)

  if (visible.length === 0) {
    return <div className="hidden min-w-[9.5rem] sm:block sm:min-w-[11rem]" aria-hidden="true" />
  }

  return (
    <ul
      className={[
        'm-0 flex list-none flex-col gap-2',
        side === 'left' ? 'items-end' : 'items-start',
      ].join(' ')}
      aria-label={t(side === 'left' ? 'upgrades.ownedLeft' : 'upgrades.ownedRight')}
    >
      {visible.map((upgrade) => (
        <li key={upgrade.id}>
          <OwnedUpgradeChip upgrade={upgrade} />
        </li>
      ))}
    </ul>
  )
}
