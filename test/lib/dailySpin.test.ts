import { describe, expect, it } from 'vitest'
import {
  dailyCashSpinCode,
  dailyDropSpinCode,
  isCashSpinCode,
  parseCashSpinAmount,
  toSpinCaseDrop,
} from '../../src/lib/dailySpin'

describe('dailySpin', () => {
  it('maps skin and cash drops to spinner codes', () => {
    expect(
      dailyDropSpinCode({
        type: 'SKIN',
        itemId: 3,
        itemCode: 'AK_47_SLATE',
        itemDisplayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        weight: 10,
      }),
    ).toBe('AK_47_SLATE')

    expect(dailyDropSpinCode({ type: 'CASH', cashAmount: 5, weight: 40 })).toBe(
      dailyCashSpinCode(5),
    )
    expect(isCashSpinCode(dailyCashSpinCode(5))).toBe(true)
    expect(parseCashSpinAmount(dailyCashSpinCode(12.5))).toBe(12.5)
  })

  it('converts daily drops to CaseDrop shape', () => {
    const skin = toSpinCaseDrop({
      type: 'SKIN',
      itemId: 3,
      itemCode: 'AK_47_SLATE',
      itemDisplayName: 'AK-47 | Slate',
      rarity: 'RESTRICTED',
      weight: 10,
    })
    expect(skin).toEqual({
      itemId: 3,
      code: 'AK_47_SLATE',
      displayName: 'AK-47 | Slate',
      rarity: 'RESTRICTED',
      weight: 10,
    })

    const cash = toSpinCaseDrop({ type: 'CASH', cashAmount: 5, weight: 40 })
    expect(cash.code).toBe('CASH:5')
    expect(cash.displayName).toBe('')
    expect(cash.weight).toBe(40)
    expect(cash.itemId).toBeLessThan(0)
  })
})
