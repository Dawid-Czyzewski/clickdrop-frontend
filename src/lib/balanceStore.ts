type BalanceListener = (balance: number | null) => void

let sharedBalance: number | null = null
const listeners = new Set<BalanceListener>()

export function getSharedBalance(): number | null {
  return sharedBalance
}

export function setSharedBalance(next: number | null): void {
  sharedBalance = next
  listeners.forEach((listener) => listener(next))
}

export function subscribeSharedBalance(listener: BalanceListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Test helper — clears shared balance between tests */
export function resetSharedBalance(): void {
  sharedBalance = null
  listeners.clear()
}
