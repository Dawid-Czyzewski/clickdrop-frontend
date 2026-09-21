import { describe, expect, it } from 'vitest'
import type { CaseDrop } from '../../src/api/casesApi'
import {
  buildSpinStrip,
  SPIN_WINNER_INDEX,
  spinOffsetPx,
} from '../../src/lib/caseSpin'

const drops: CaseDrop[] = [
  { itemId: 1, code: 'GLOCK_WATER_ELEMENTAL', rarity: 'MIL_SPEC', weight: 50 },
  { itemId: 3, code: 'AK_REDLINE', rarity: 'RESTRICTED', weight: 15 },
]

describe('caseSpin', () => {
  it('places the winner at the configured strip index', () => {
    const strip = buildSpinStrip(drops, 'AK_REDLINE', {
      random: () => 0,
    })

    expect(strip[SPIN_WINNER_INDEX]?.code).toBe('AK_REDLINE')
    expect(strip).toHaveLength(52)
  })

  it('centers the winner under the viewport marker', () => {
    expect(spinOffsetPx(44, 600, 120)).toBe(-(44 * 120) + 300 - 60)
  })
})
