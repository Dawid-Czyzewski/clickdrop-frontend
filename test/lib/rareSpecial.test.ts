import { describe, expect, it } from 'vitest'
import type { CaseDrop } from '../../src/api/casesApi'
import {
  collapseRareSpecialDrops,
  isRareSpecialItem,
} from '../../src/lib/rareSpecial'

const drop = (
  partial: Partial<CaseDrop> & Pick<CaseDrop, 'itemId' | 'code' | 'weight'>,
): CaseDrop => ({
  displayName: partial.displayName ?? partial.code,
  rarity: partial.rarity ?? 'COVERT',
  ...partial,
})

describe('rareSpecial', () => {
  it('detects knives, gloves, and starred names', () => {
    expect(isRareSpecialItem('BUTTERFLY_KNIFE_FADE')).toBe(true)
    expect(isRareSpecialItem('SPORT_GLOVES_VICE')).toBe(true)
    expect(isRareSpecialItem('HAND_WRAPS_CAUTION')).toBe(true)
    expect(isRareSpecialItem('AK_47_ASIIMOV')).toBe(false)
    expect(isRareSpecialItem('X', '★ Talon Knife | Fade')).toBe(true)
  })

  it('collapses rare specials into one tile with summed weight', () => {
    const views = collapseRareSpecialDrops([
      drop({ itemId: 1, code: 'AK_47_ASIIMOV', weight: 64, rarity: 'COVERT' }),
      drop({ itemId: 2, code: 'BUTTERFLY_KNIFE_FADE', weight: 2, displayName: '★ Butterfly Knife | Fade' }),
      drop({ itemId: 3, code: 'SPORT_GLOVES_VICE', weight: 2, displayName: '★ Sport Gloves | Vice' }),
      drop({ itemId: 4, code: 'GLOCK_18_MOONRISE', weight: 800, rarity: 'RESTRICTED' }),
    ])

    expect(views).toHaveLength(3)
    const rare = views.find((v) => v.kind === 'rareSpecial')
    expect(rare).toEqual({ kind: 'rareSpecial', weight: 4, count: 2 })
    expect(views[0]?.kind === 'rareSpecial' || views[0]?.kind === 'item').toBe(true)
  })
})
