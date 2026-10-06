import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../src/api/client'
import { useIdleCollect } from '../../src/hooks/useIdleCollect'
import i18n from '../utils/i18n'

vi.mock('../../src/api/economyApi', () => ({
  collectIdle: vi.fn(),
  getIdleStatus: vi.fn(),
}))

import { collectIdle, getIdleStatus } from '../../src/api/economyApi'

const collectIdleMock = vi.mocked(collectIdle)
const getIdleStatusMock = vi.mocked(getIdleStatus)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

describe('useIdleCollect', () => {
  beforeEach(() => {
    collectIdleMock.mockReset()
    getIdleStatusMock.mockReset()
    getIdleStatusMock.mockResolvedValue({
      pending: 1.2,
      incomePerSecond: 0.1,
      lastIdleCollectedAt: new Date(Date.now() - 12_500).toISOString(),
    })
  })

  it('loads pending idle amount from status', async () => {
    const { result } = renderHook(() => useIdleCollect(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pending).toBe(1.2)
    expect(getIdleStatusMock).toHaveBeenCalledTimes(1)
  })

  it('collectIdle clears pending and returns payload', async () => {
    collectIdleMock.mockResolvedValue({
      earned: 1.25,
      balance: 50.25,
      incomePerSecond: 0.1,
    })

    const { result } = renderHook(() => useIdleCollect(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const collected = await act(async () => result.current.collectIdle())

    expect(collected?.balance).toBe(50.25)
    expect(result.current.pending).toBe(0)
    expect(collectIdleMock).toHaveBeenCalledTimes(1)
  })

  it('maps economy errors', async () => {
    getIdleStatusMock.mockRejectedValue(new ApiError(401, 'Unauthorized'))

    const { result } = renderHook(() => useIdleCollect(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.error).toBe('Your session has expired. Please sign in again.')
    })
  })

  it('does nothing when disabled', async () => {
    const { result } = renderHook(() => useIdleCollect({ enabled: false }), {
      wrapper: HookProviders,
    })

    const collected = await act(async () => result.current.collectIdle())

    expect(collected).toBeNull()
    expect(collectIdleMock).not.toHaveBeenCalled()
    expect(getIdleStatusMock).not.toHaveBeenCalled()
  })
})
