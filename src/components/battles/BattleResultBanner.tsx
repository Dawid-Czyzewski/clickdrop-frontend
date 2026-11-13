'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { BattleResponse } from '../../api/battlesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { cdBodyMuted, cdBtnGhost, cdBtnPrimaryLink } from '../ui/uiStyles'

type BattleResultBannerProps = {
  battle: BattleResponse
  userId: number | null
  onPlayAgain: () => void
}

export function BattleResultBanner({
  battle,
  userId,
  onPlayAgain,
}: BattleResultBannerProps) {
  const { t, i18n } = useTranslation()
  const youWon = userId != null && battle.winnerUserId === userId
  const botWon = battle.winnerUserId == null

  return (
    <section
      className="cd-battle-result flex flex-col items-center gap-4 rounded-xl border border-cd-accent/40 bg-cd-surface p-5 text-center shadow-xl"
      role="status"
      aria-live="polite"
    >
      <p className="font-display text-[0.65rem] tracking-[0.22em] text-cd-accent uppercase">
        {t('battles.resultEyebrow')}
      </p>
      <h2 className="font-display text-2xl font-semibold text-cd-text">
        {youWon ? t('battles.youWon') : botWon ? t('battles.botWon') : t('battles.youLost')}
      </h2>
      <p className={`max-w-md text-sm ${cdBodyMuted}`}>
        {youWon ? t('battles.youWonBody') : t('battles.lostBody')}
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <p>
          <span className={cdBodyMuted}>{t('battles.you')}: </span>
          <span className="font-display font-semibold text-cd-accent">
            {formatClickDollars(battle.player1TotalValue, i18n.language)} CD
          </span>
        </p>
        <p>
          <span className={cdBodyMuted}>{t('battles.bot')}: </span>
          <span className="font-display font-semibold text-cd-text">
            {formatClickDollars(battle.player2TotalValue, i18n.language)} CD
          </span>
        </p>
      </div>
      <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href="/inventory" className={`${cdBtnPrimaryLink} min-h-11 px-4`}>
          {t('battles.toInventory')}
        </Link>
        <button type="button" onClick={onPlayAgain} className={`${cdBtnGhost} min-h-11 px-4`}>
          {t('battles.playAgain')}
        </button>
      </div>
    </section>
  )
}
