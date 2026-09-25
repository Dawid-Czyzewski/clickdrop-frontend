import type { CaseDrop } from '../api/casesApi'
import type { DailyDrop } from '../api/dailyApi'

export function dailyCashSpinCode(cashAmount: number): string {
  return `CASH:${cashAmount}`
}

export function isCashSpinCode(code: string): boolean {
  return code.startsWith('CASH:')
}

export function parseCashSpinAmount(code: string): number | null {
  if (!isCashSpinCode(code)) return null
  const amount = Number(code.slice('CASH:'.length))
  return Number.isFinite(amount) ? amount : null
}

export function dailyDropSpinCode(drop: DailyDrop): string {
  return drop.type === 'SKIN' ? drop.itemCode : dailyCashSpinCode(drop.cashAmount)
}

export function toSpinCaseDrop(drop: DailyDrop): CaseDrop {
  if (drop.type === 'SKIN') {
    return {
      itemId: drop.itemId,
      code: drop.itemCode,
      rarity: drop.rarity,
      weight: drop.weight,
    }
  }

  return {
    itemId: -Math.round(drop.cashAmount * 100) || -1,
    code: dailyCashSpinCode(drop.cashAmount),
    rarity: 'MIL_SPEC',
    weight: drop.weight,
  }
}
