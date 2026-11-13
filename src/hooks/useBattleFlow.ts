'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createBattle, type BattleResponse } from '../api/battlesApi'
import { resolveBattleError } from '../api/resolveBattleError'
import { getBalance } from '../api/economyApi'
import type { GameCase } from '../api/casesApi'
import { groupBattleRounds } from '../lib/battleRounds'

export type BattlePhase = 'setup' | 'creating' | 'playing' | 'result'
export type BattleRoundsChoice = 1 | 3 | 5

const REVEAL_MS = 850

type UseBattleFlowOptions = {
  onBalance: (balance: number) => void
}

export function useBattleFlow({ onBalance }: UseBattleFlowOptions) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<BattlePhase>('setup')
  const [caseId, setCaseId] = useState<number | null>(null)
  const [rounds, setRounds] = useState<BattleRoundsChoice>(1)
  const [battle, setBattle] = useState<BattleResponse | null>(null)
  const [revealedRounds, setRevealedRounds] = useState(0)
  const [error, setError] = useState('')
  const timerRef = useRef<number | null>(null)

  const grouped = useMemo(
    () => (battle ? groupBattleRounds(battle.roundsDrops) : []),
    [battle],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current)
    }
  }, [])

  function selectCase(id: number) {
    if (phase !== 'setup') return
    setCaseId(id)
    setError('')
  }

  function selectRounds(next: BattleRoundsChoice) {
    if (phase !== 'setup') return
    setRounds(next)
    setError('')
  }

  function stakeFor(gameCase: GameCase | undefined): number {
    if (!gameCase) return 0
    return gameCase.price * rounds
  }

  async function startVsBot() {
    if (phase !== 'setup' || caseId == null) return
    setPhase('creating')
    setError('')
    try {
      const result = await createBattle({ caseId, rounds, vsBot: true })
      const bal = await getBalance()
      onBalance(bal.balance)
      setBattle(result)
      setRevealedRounds(0)
      setPhase('playing')
      startReveal(result.rounds)
    } catch (err) {
      setError(resolveBattleError(err, t))
      setPhase('setup')
    }
  }

  function startReveal(totalRounds: number) {
    if (timerRef.current != null) window.clearInterval(timerRef.current)
    let shown = 0
    timerRef.current = window.setInterval(() => {
      shown += 1
      setRevealedRounds(shown)
      if (shown >= totalRounds) {
        if (timerRef.current != null) window.clearInterval(timerRef.current)
        timerRef.current = null
        setPhase('result')
      }
    }, REVEAL_MS)
  }

  function reset() {
    if (timerRef.current != null) window.clearInterval(timerRef.current)
    timerRef.current = null
    setPhase('setup')
    setBattle(null)
    setRevealedRounds(0)
    setError('')
  }

  return {
    phase,
    caseId,
    rounds,
    battle,
    grouped,
    revealedRounds,
    error,
    selectCase,
    selectRounds,
    stakeFor,
    startVsBot,
    reset,
  }
}
