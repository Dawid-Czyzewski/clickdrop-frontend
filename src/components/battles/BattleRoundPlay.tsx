'use client'

import { useTranslation } from 'react-i18next'
import type { BattleDrop } from '../../api/battlesApi'
import type { BattleRoundPair } from '../../lib/battleRounds'
import { runningTotals } from '../../lib/battleRounds'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { resolveItemLabel } from '../../lib/caseI18n'
import { SkinUpgradeSkinCard } from '../skinUpgrade/SkinUpgradeSkinCard'
import { cdBodyMuted } from '../ui/uiStyles'

type BattleRoundPlayProps = {
  rounds: BattleRoundPair[]
  revealedRounds: number
  totalRounds: number
}

function MiniDrop({ drop, label }: { drop: BattleDrop; label: string }) {
  const { t } = useTranslation()
  return (
    <SkinUpgradeSkinCard
      itemCode={drop.itemCode}
      itemDisplayName={resolveItemLabel(t, drop.itemCode, drop.itemDisplayName)}
      rarity={drop.rarity}
      exterior={drop.exterior}
      statTrack={drop.statTrack}
      suggestedSellPrice={drop.value}
      label={label}
      size="md"
      accent
    />
  )
}

export function BattleRoundPlay({
  rounds,
  revealedRounds,
  totalRounds,
}: BattleRoundPlayProps) {
  const { t, i18n } = useTranslation()
  const totals = runningTotals(rounds, revealedRounds)
  const current = rounds[Math.max(0, revealedRounds - 1)]

  return (
    <section className="flex flex-col gap-4" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cd-border bg-cd-surface/60 px-4 py-3">
        <p className="font-display text-sm tracking-wide text-cd-muted uppercase">
          {t('battles.roundProgress', {
            current: Math.min(revealedRounds, totalRounds),
            total: totalRounds,
          })}
        </p>
        <div className="flex gap-4 text-sm">
          <p>
            <span className={cdBodyMuted}>{t('battles.you')}: </span>
            <span className="font-display font-semibold text-cd-accent">
              {formatClickDollars(totals.player1, i18n.language)} CD
            </span>
          </p>
          <p>
            <span className={cdBodyMuted}>{t('battles.bot')}: </span>
            <span className="font-display font-semibold text-cd-text">
              {formatClickDollars(totals.player2, i18n.language)} CD
            </span>
          </p>
        </div>
      </div>

      {current?.player1 && current.player2 ? (
        <div
          key={current.roundIndex}
          className="cd-battle-round grid grid-cols-1 gap-4 sm:grid-cols-2 sm:justify-items-center"
        >
          <MiniDrop drop={current.player1} label={t('battles.yourDrop')} />
          <MiniDrop drop={current.player2} label={t('battles.botDrop')} />
        </div>
      ) : (
        <p className={cdBodyMuted}>{t('battles.rolling')}</p>
      )}

      <ul className="flex flex-col gap-2">
        {rounds.slice(0, revealedRounds).map((round) => (
          <li
            key={round.roundIndex}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-cd-border/80 px-3 py-2 text-sm"
          >
            <span className="text-cd-muted">
              {t('battles.roundLabel', { n: round.roundIndex + 1 })}
            </span>
            <span className="font-display text-cd-text">
              {formatClickDollars(round.player1?.value ?? 0, i18n.language)} vs{' '}
              {formatClickDollars(round.player2?.value ?? 0, i18n.language)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
