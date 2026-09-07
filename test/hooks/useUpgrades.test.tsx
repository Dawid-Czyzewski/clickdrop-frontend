import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../src/api/client'
import { useUpgrades } from '../../src/hooks/useUpgrades'
import i18n from '../utils/i18n'

vi.mock('../../src/api/economyApi', () => ({
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { buyUpgrade, getMyUpgrades } from '../../src/api/economyApi'

const getMyUpgradesMock = vi.mocked(getMyUpgrades)
const buyUpgradeMock = vi.mocked(buyUpgrade)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

const mouse = {
  id: 1,
  code: 'BETTER_MOUSE',
  tier: 1,
  price: 50,
  clickPower: 1,
  level: 1,
  nextCost: 50,
}

describe('useUpgrades', () => {
  beforeEach(() => {
    getMyUpgradesMock.mockReset()
    buyUpgradeMock.mockReset()
  })

  it('loads my upgrades from API', async () => {
    getMyUpgradesMock.mockResolvedValue([mouse])

    const { result } = renderHook(() => useUpgrades(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.upgrades).toEqual([mouse])
    expect(result.current.error).toBe('')
  })

  it('buyUpgrade refreshes list and returns purchase result', async () => {
    getMyUpgradesMock
      .mockResolvedValueOnce([mouse])
      .mockResolvedValueOnce([{ ...mouse, level: 2 }])
    buyUpgradeMock.mockResolvedValue({
      upgradeId: 1,
      code: 'BETTER_MOUSE',
      level: 2,
      balance: 25,
      cost: 50,
    })

    const { result } = renderHook(() => useUpgrades(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let purchase: Awaited<ReturnType<typeof result.current.buyUpgrade>> = null
    await act(async () => {
      purchase = await result.current.buyUpgrade(1)
    })

    expect(purchase?.balance).toBe(25)
    expect(result.current.upgrades[0]?.level).toBe(2)
    expect(buyUpgradeMock).toHaveBeenCalledWith(1)
  })

  it('maps insufficient funds error', async () => {
    getMyUpgradesMock.mockResolvedValue([mouse])
    buyUpgradeMock.mockRejectedValue(new ApiError(400, 'Insufficient ClickDollars'))

    const { result } = renderHook(() => useUpgrades(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.buyUpgrade(1)
    })

    expect(result.current.error).toBe('Not enough ClickDollars')
  })
})
