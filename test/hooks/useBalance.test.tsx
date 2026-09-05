import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../src/api/client'
import { useBalance } from '../../src/hooks/useBalance'
import i18n from '../utils/i18n'

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
}))

import { getBalance } from '../../src/api/economyApi'

const getBalanceMock = vi.mocked(getBalance)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

describe('useBalance', () => {
  beforeEach(() => {
    getBalanceMock.mockReset()
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
})
