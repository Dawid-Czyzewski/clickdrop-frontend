import { describe, expect, it } from 'vitest'
import type { BattleDrop } from '../../src/api/battlesApi'
import { groupBattleRounds, runningTotals } from '../../src/lib/battleRounds'

function drop(
  roundIndex: number,
  side: 'PLAYER1' | 'PLAYER2',
  value: number,
): BattleDrop {
  return {
    roundIndex,
    side,
    itemId: 1,
    itemCode: 'USP_A',
    itemDisplayName: 'USP A',
    rarity: 'MIL_SPEC',
    exterior: 'FIELD_TESTED',
    statTrack: false,
    floatValue: 0.25,
    paintSeed: 123,
    value,
    inventoryItemId: 10,
  }
}

describe('battleRounds', () => {
  it('groups drops by round and accumulates revealed totals', () => {
    const grouped = groupBattleRounds([
      drop(0, 'PLAYER1', 40),
      drop(0, 'PLAYER2', 10),
      drop(1, 'PLAYER1', 20),
      drop(1, 'PLAYER2', 30),
    ])

    expect(grouped).toHaveLength(2)
    expect(grouped[0]?.player1?.value).toBe(40)
    expect(runningTotals(grouped, 1)).toEqual({ player1: 40, player2: 10 })
    expect(runningTotals(grouped, 2)).toEqual({ player1: 60, player2: 40 })
  })
})
