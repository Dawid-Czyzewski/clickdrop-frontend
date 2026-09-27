'use client'

import { useTranslation } from 'react-i18next'
import type { ItemExterior, ItemRarity } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import {
  exteriorLabelKey,
  RARITY_COLOR,
  rarityLabelKey,
  resolveItemLabel,
} from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'

type SkinUpgradeSkinCardProps = {
  itemCode: string
  itemDisplayName?: string
  rarity: ItemRarity
  exterior?: ItemExterior
  suggestedSellPrice: number
  label?: string
  accent?: boolean
  footnote?: string
  size?: 'md' | 'lg'
}

export function SkinUpgradeSkinCard({
  itemCode,
  itemDisplayName,
  rarity,
  exterior,
  suggestedSellPrice,
  label,
  accent = false,
  footnote,
  size = 'md',
}: SkinUpgradeSkinCardProps) {
  const { t, i18n } = useTranslation()
  const color = RARITY_COLOR[rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, itemCode, itemDisplayName)
  const large = size === 'lg'

  return (
    <div
      className={`flex flex-col items-center gap-2 ${
        large ? 'w-[min(100%,20rem)]' : 'w-[min(100%,11.5rem)]'
      }`}
    >
      {label ? (
        <p
          className={`font-medium tracking-wide text-cd-muted uppercase ${
            large ? 'text-xs' : 'text-[0.65rem]'
          }`}
        >
          {label}
        </p>
      ) : null}
      <article
        className={`flex w-full flex-col overflow-hidden rounded-lg border bg-cd-surface/80 ${
          accent ? 'border-cd-accent/40' : 'border-cd-border'
        }`}
      >
        <div
          className={`w-full shrink-0 ${large ? 'h-1' : 'h-0.5'}`}
          style={{ backgroundColor: color }}
        />
        <div className={`flex flex-col ${large ? 'gap-3 p-4' : 'gap-2 p-2.5'}`}>
          <div
            className={`flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md bg-cd-bg/40 ${
              large ? 'p-3' : 'p-1'
            }`}
            style={{
              background: `radial-gradient(circle at 50% 40%, ${color}22, transparent 70%)`,
            }}
          >
            <AssetImage
              kind="item"
              code={itemCode}
              alt={name}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 text-center">
            <p
              className={`font-medium tracking-wide uppercase ${large ? 'text-xs' : 'text-[0.6rem]'}`}
              style={{ color }}
            >
              {t(rarityLabelKey(rarity))}
            </p>
            <p
              className={`mt-0.5 truncate font-display font-semibold text-cd-text ${
                large ? 'text-lg' : 'text-sm'
              }`}
            >
              {name}
            </p>
            {exterior ? (
              <p className={`truncate text-cd-muted ${large ? 'text-sm' : 'text-xs'}`}>
                {t(exteriorLabelKey(exterior))}
              </p>
            ) : null}
            <p
              className={`mt-0.5 font-display text-cd-accent ${large ? 'text-base' : 'text-xs'}`}
            >
              {formatClickDollars(suggestedSellPrice, i18n.language)} CD
            </p>
            {footnote ? (
              <p className={`mt-1 text-cd-muted ${large ? 'text-xs' : 'text-[0.65rem]'}`}>
                {footnote}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  )
}
