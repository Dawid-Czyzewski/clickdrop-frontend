import type { BattleDrop, BattleSide } from '../api/battlesApi'

export type BattleRoundPair = {
  roundIndex: number
  player1: BattleDrop | null
  player2: BattleDrop | null
}

export function groupBattleRounds(drops: BattleDrop[]): BattleRoundPair[] {
  const byRound = new Map<number, BattleRoundPair>()
  for (const drop of drops) {
    const row = byRound.get(drop.roundIndex) ?? {
      roundIndex: drop.roundIndex,
      player1: null,
      player2: null,
    }
    if (drop.side === 'PLAYER1') row.player1 = drop
    if (drop.side === 'PLAYER2') row.player2 = drop
    byRound.set(drop.roundIndex, row)
  }
  return [...byRound.values()].sort((a, b) => a.roundIndex - b.roundIndex)
}

export function runningTotals(
  rounds: BattleRoundPair[],
  revealedCount: number,
): { player1: number; player2: number } {
  let player1 = 0
  let player2 = 0
  for (const round of rounds.slice(0, Math.max(0, revealedCount))) {
    player1 += round.player1?.value ?? 0
    player2 += round.player2?.value ?? 0
  }
  return { player1, player2 }
}

export function dropForSide(
  rounds: BattleRoundPair[],
  roundIndex: number,
  side: BattleSide,
): BattleDrop | null {
  const round = rounds.find((row) => row.roundIndex === roundIndex)
  if (!round) return null
  return side === 'PLAYER1' ? round.player1 : round.player2
}
