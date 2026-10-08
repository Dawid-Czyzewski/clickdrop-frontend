import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RecentDrop } from '../../src/api/dropsApi'
import { useRecentDrops } from '../../src/hooks/useRecentDrops'
import i18n from '../utils/i18n'

vi.mock('../../src/api/dropsApi', () => ({
  getRecentDrops: vi.fn(),
}))

import { getRecentDrops } from '../../src/api/dropsApi'

const getRecentDropsMock = vi.mocked(getRecentDrops)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

const drop: RecentDrop = {
  itemCode: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED',
  exterior: 'FIELD_TESTED',
  statTrack: false,
  source: 'CASE',
  createdAt: '2026-04-01T12:00:00Z',
}

describe('useRecentDrops', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    getRecentDropsMock.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads drops without auth and polls on an interval', async () => {
    getRecentDropsMock.mockResolvedValue([drop])

    const { result } = renderHook(() => useRecentDrops({ pollMs: 20_000 }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.drops).toEqual([drop])
    expect(result.current.error).toBe('')
    expect(getRecentDropsMock).toHaveBeenCalledTimes(1)

    getRecentDropsMock.mockResolvedValue([
      { ...drop, itemCode: 'AWP_ASIIMOV', displayName: 'AWP | Asiimov' },
      drop,
    ])

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20_000)
    })

    await waitFor(() => {
      expect(result.current.drops[0]?.itemCode).toBe('AWP_ASIIMOV')
    })
    expect(getRecentDropsMock).toHaveBeenCalledTimes(2)
  })

  it('surfaces load errors', async () => {
    getRecentDropsMock.mockRejectedValue(new Error('network'))

    const { result } = renderHook(() => useRecentDrops(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.drops).toEqual([])
    expect(result.current.error).toBeTruthy()
  })
})
