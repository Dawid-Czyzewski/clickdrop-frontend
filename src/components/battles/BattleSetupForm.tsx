'use client'

import { useTranslation } from 'react-i18next'
import type { GameCase } from '../../api/casesApi'
import type { BattleRoundsChoice } from '../../hooks/useBattleFlow'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { resolveCaseLabel } from '../../lib/caseI18n'
import { cdBodyMuted, cdBtnPrimary } from '../ui/uiStyles'

type BattleSetupFormProps = {
  cases: GameCase[]
  caseId: number | null
  rounds: BattleRoundsChoice
  stake: number
  balance: number | null
  busy: boolean
  onSelectCase: (id: number) => void
  onSelectRounds: (rounds: BattleRoundsChoice) => void
  onStart: () => void
}

const ROUND_OPTIONS: BattleRoundsChoice[] = [1, 3, 5]

export function BattleSetupForm({
  cases,
  caseId,
  rounds,
  stake,
  balance,
  busy,
  onSelectCase,
  onSelectRounds,
  onStart,
}: BattleSetupFormProps) {
  const { t, i18n } = useTranslation()
  const selected = cases.find((c) => c.id === caseId)
  const canAfford = balance == null || balance >= stake
  const canStart = caseId != null && !busy && canAfford

  return (
    <section className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm text-cd-muted" htmlFor="battle-case">
          {t('battles.caseLabel')}
        </label>
        <select
          id="battle-case"
          className="min-h-11 w-full max-w-md rounded-md border border-cd-border bg-cd-bg px-3 text-cd-text"
          value={caseId ?? ''}
          disabled={busy}
          onChange={(e) => onSelectCase(Number(e.target.value))}
        >
          <option value="" disabled>
            {t('battles.casePlaceholder')}
          </option>
          {cases.map((gameCase) => (
            <option key={gameCase.id} value={gameCase.id}>
              {resolveCaseLabel(t, gameCase.code, gameCase.displayName)}:{' '}
              {formatClickDollars(gameCase.price, i18n.language)} CD
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm text-cd-muted">{t('battles.roundsLabel')}</legend>
        <div className="flex flex-wrap gap-2">
          {ROUND_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              disabled={busy}
              onClick={() => onSelectRounds(option)}
              className={[
                'min-h-11 min-w-14 rounded-md border px-3 font-display text-sm font-semibold',
                rounds === option
                  ? 'border-cd-accent bg-cd-accent text-cd-bg'
                  : 'border-cd-border bg-cd-bg text-cd-text',
              ].join(' ')}
            >
              {t('battles.roundsOption', { count: option })}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="rounded-lg border border-cd-border bg-cd-surface/60 px-4 py-3">
        <p className={`text-sm ${cdBodyMuted}`}>{t('battles.stakeHint')}</p>
        <p className="mt-1 font-display text-lg font-semibold text-cd-accent">
          {t('battles.stakeValue', {
            amount: formatClickDollars(stake, i18n.language),
          })}
        </p>
        {selected ? (
          <p className={`mt-1 text-xs ${cdBodyMuted}`}>
            {t('battles.stakeBreakdown', {
              price: formatClickDollars(selected.price, i18n.language),
              rounds,
            })}
          </p>
        ) : null}
        {!canAfford ? (
          <p className="mt-2 text-sm text-cd-danger">{t('battles.errorFunds')}</p>
        ) : null}
      </div>

      <button
        type="button"
        disabled={!canStart}
        aria-busy={busy || undefined}
        onClick={onStart}
        className={`${cdBtnPrimary} min-h-11 w-full max-w-md px-4 sm:w-auto`}
      >
        {busy ? t('battles.starting') : t('battles.startVsBot')}
      </button>
    </section>
  )
}
