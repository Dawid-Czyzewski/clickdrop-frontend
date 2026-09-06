import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../src/api/client'
import { useBalance } from '../../src/hooks/useBalance'
import i18n from '../utils/i18n'

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  clickToEarn: vi.fn(),
}))

import { clickToEarn, getBalance } from '../../src/api/economyApi'

const getBalanceMock = vi.mocked(getBalance)
const clickToEarnMock = vi.mocked(clickToEarn)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

describe('useBalance', () => {
  beforeEach(() => {
    getBalanceMock.mockReset()
    clickToEarnMock.mockReset()
  })

  it('loads balance from economy API', async () => {
    getBalanceMock.mockResolvedValue({ balance: 0 })

    const { result } = renderHook(() => useBalance(), { wrapper: HookProviders })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.balance).toBe(0)
    expect(result.current.error).toBe('')
    expect(result.current.isClicking).toBe(false)
  })

  it('sets error when balance request fails', async () => {
    getBalanceMock.mockRejectedValue(new ApiError(500, 'down'))

    const { result } = renderHook(() => useBalance(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.balance).toBeNull()
    expect(result.current.error).toBe(
      'The economy service is unavailable. Please try again later.',
    )
  })

  it('does not fetch when disabled', async () => {
    const { result } = renderHook(() => useBalance({ enabled: false }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(getBalanceMock).not.toHaveBeenCalled()
    expect(result.current.balance).toBeNull()
  })

  it('clickToEarn updates balance from response', async () => {
    getBalanceMock.mockResolvedValue({ balance: 14 })
    clickToEarnMock.mockResolvedValue({ balance: 15, earned: 1 })

    const { result } = renderHook(() => useBalance(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let clickResult: Awaited<ReturnType<typeof result.current.clickToEarn>> = null
    await act(async () => {
      clickResult = await result.current.clickToEarn()
    })

    expect(clickResult).toEqual({ balance: 15, earned: 1 })
    expect(result.current.balance).toBe(15)
    expect(result.current.isClicking).toBe(false)
    expect(result.current.error).toBe('')
  })

  it('clickToEarn sets error and keeps previous balance', async () => {
    getBalanceMock.mockResolvedValue({ balance: 14 })
    clickToEarnMock.mockRejectedValue(new ApiError(500, 'down'))

    const { result } = renderHook(() => useBalance(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.balance).toBe(14)
    })

    await act(async () => {
      await result.current.clickToEarn()
    })

    expect(result.current.balance).toBe(14)
    expect(result.current.error).toBe(
      'The economy service is unavailable. Please try again later.',
    )
    expect(result.current.isClicking).toBe(false)
  })

  it('ignores concurrent clickToEarn while a request is in flight', async () => {
    getBalanceMock.mockResolvedValue({ balance: 10 })

    let resolveClick!: (value: { balance: number; earned: number }) => void
    clickToEarnMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveClick = resolve
        }),
    )

    const { result } = renderHook(() => useBalance(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let firstPromise!: Promise<unknown>
    act(() => {
      firstPromise = result.current.clickToEarn()
    })

    await waitFor(() => {
      expect(result.current.isClicking).toBe(true)
    })

    let secondResult: unknown
    await act(async () => {
      secondResult = await result.current.clickToEarn()
    })

    expect(secondResult).toBeNull()
    expect(clickToEarnMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveClick({ balance: 11, earned: 1 })
      await firstPromise
    })

    expect(result.current.balance).toBe(11)
    expect(result.current.isClicking).toBe(false)
  })
})
