import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useClickPower } from '../../src/hooks/useClickPower'
import i18n from '../utils/i18n'

vi.mock('../../src/api/economyApi', () => ({
  getClickPower: vi.fn(),
}))

import { getClickPower } from '../../src/api/economyApi'

const getClickPowerMock = vi.mocked(getClickPower)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

describe('useClickPower', () => {
  beforeEach(() => {
    getClickPowerMock.mockReset()
  })

  it('loads rewardPerClick from API', async () => {
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 4 })

    const { result } = renderHook(() => useClickPower(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.rewardPerClick).toBe(4)
    expect(result.current.error).toBe('')
  })

  it('refresh reloads rewardPerClick after upgrades change', async () => {
    getClickPowerMock
      .mockResolvedValueOnce({ rewardPerClick: 1 })
      .mockResolvedValueOnce({ rewardPerClick: 4 })

    const { result } = renderHook(() => useClickPower(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.rewardPerClick).toBe(1)
    })

    await act(async () => {
      await result.current.refresh()
    })

    expect(result.current.rewardPerClick).toBe(4)
    expect(getClickPowerMock).toHaveBeenCalledTimes(2)
  })

  it('does not fetch when disabled', async () => {
    const { result } = renderHook(() => useClickPower({ enabled: false }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(getClickPowerMock).not.toHaveBeenCalled()
    expect(result.current.rewardPerClick).toBeNull()
  })
})
