import { useState } from 'react'

export type SoldToast = {
  id: number
  amount: number
}

export function useSoldToast() {
  const [soldToast, setSoldToast] = useState<SoldToast | null>(null)

  function showSoldToast(amount: number) {
    if (!(amount > 0)) return
    setSoldToast((prev) => ({ id: (prev?.id ?? 0) + 1, amount }))
  }

  function dismissSoldToast() {
    setSoldToast(null)
  }

  return { soldToast, showSoldToast, dismissSoldToast }
}
