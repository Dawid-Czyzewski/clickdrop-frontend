'use client'

import { useTranslation } from 'react-i18next'
import { exteriorLabelKey, rarityLabelKey } from '../../lib/caseI18n'
import {
  INVENTORY_EXTERIORS,
  INVENTORY_RARITIES,
  type InventoryFilterState,
  type InventorySort,
  type StatTrackFilter,
} from '../../lib/inventoryFilters'
import { cdBtnGhost, cdSectionLabel } from '../ui/uiStyles'

type InventoryFiltersProps = {
  filters: InventoryFilterState
  hasActiveFilters: boolean
  onChange: (patch: Partial<InventoryFilterState>) => void
  onClear: () => void
}

const selectClass =
  'h-9 min-w-0 flex-1 cursor-pointer rounded-md border border-cd-border bg-cd-bg px-2 text-sm text-cd-text sm:min-w-[8.5rem] sm:flex-none'

export function InventoryFilters({
  filters,
  hasActiveFilters,
  onChange,
  onClear,
}: InventoryFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2" aria-label={t('inventory.filtersLabel')}>
      <p className={cdSectionLabel}>{t('inventory.filtersLabel')}</p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-w-[9rem] flex-1 flex-col gap-1 text-xs text-cd-muted sm:flex-none">
          <span>{t('inventory.filterRarity')}</span>
          <select
            className={selectClass}
            value={filters.rarity}
            onChange={(e) =>
              onChange({
                rarity: e.target.value as InventoryFilterState['rarity'],
              })
            }
          >
            <option value="all">{t('inventory.filterAll')}</option>
            {INVENTORY_RARITIES.map((rarity) => (
              <option key={rarity} value={rarity}>
                {t(rarityLabelKey(rarity))}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[9rem] flex-1 flex-col gap-1 text-xs text-cd-muted sm:flex-none">
          <span>{t('inventory.filterStatTrack')}</span>
          <select
            className={selectClass}
            value={filters.statTrack}
            onChange={(e) =>
              onChange({ statTrack: e.target.value as StatTrackFilter })
            }
          >
            <option value="all">{t('inventory.filterAll')}</option>
            <option value="yes">{t('inventory.filterStatTrackYes')}</option>
            <option value="no">{t('inventory.filterStatTrackNo')}</option>
          </select>
        </label>

        <label className="flex min-w-[9rem] flex-1 flex-col gap-1 text-xs text-cd-muted sm:flex-none">
          <span>{t('inventory.filterExterior')}</span>
          <select
            className={selectClass}
            value={filters.exterior}
            onChange={(e) =>
              onChange({
                exterior: e.target.value as InventoryFilterState['exterior'],
              })
            }
          >
            <option value="all">{t('inventory.filterAll')}</option>
            {INVENTORY_EXTERIORS.map((exterior) => (
              <option key={exterior} value={exterior}>
                {t(exteriorLabelKey(exterior))}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[9rem] flex-1 flex-col gap-1 text-xs text-cd-muted sm:flex-none">
          <span>{t('inventory.sortLabel')}</span>
          <select
            className={selectClass}
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as InventorySort })}
          >
            <option value="price_desc">{t('inventory.sortPriceDesc')}</option>
            <option value="price_asc">{t('inventory.sortPriceAsc')}</option>
            <option value="rarity">{t('inventory.sortRarity')}</option>
            <option value="name">{t('inventory.sortName')}</option>
          </select>
        </label>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClear}
            className={`${cdBtnGhost} h-9 px-3 text-sm sm:mt-5`}
          >
            {t('inventory.clearFilters')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
