import { describe, expect, it } from 'vitest'
import type { CaseDrop } from '../../src/api/casesApi'
import {
  buildSpinStrip,
  SPIN_WINNER_INDEX,
  spinOffsetPx,
} from '../../src/lib/caseSpin'

const drops: CaseDrop[] = [
  {
    itemId: 1,
    code: 'GLOCK_18_UMBRAL_RABBIT',
    displayName: 'Glock-18 | Umbral Rabbit',
    rarity: 'MIL_SPEC',
    weight: 50,
  },
  {
    itemId: 3,
    code: 'AK_47_SLATE',
    displayName: 'AK-47 | Slate',
    rarity: 'RESTRICTED',
    weight: 15,
  },
]

describe('caseSpin', () => {
  it('places the winner at the configured strip index', () => {
    const strip = buildSpinStrip(drops, 'AK_47_SLATE', {
      random: () => 0,
    })

    expect(strip[SPIN_WINNER_INDEX]?.code).toBe('AK_47_SLATE')
    expect(strip).toHaveLength(52)
  })

  it('centers the winner under the viewport marker', () => {
    expect(spinOffsetPx(44, 600, 120)).toBe(-(44 * 120) + 300 - 60)
  })
})
