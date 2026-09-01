import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../src/api/client'
import { useCurrentUser } from '../../src/hooks/useCurrentUser'
import i18n from '../utils/i18n'

vi.mock('../../src/api/usersApi', () => ({
  getCurrentUser: vi.fn(),
}))

import { getCurrentUser } from '../../src/api/usersApi'

const getCurrentUserMock = vi.mocked(getCurrentUser)

function HookProviders({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{children}</MemoryRouter>
    </I18nextProvider>
  )
}

describe('useCurrentUser', () => {
  beforeEach(() => {
    getCurrentUserMock.mockReset()
  })

  it('loads current user profile', async () => {
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 450,
      clickDollars: 12.5,
    })

    const { result } = renderHook(() => useCurrentUser(), { wrapper: HookProviders })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toEqual({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 450,
      clickDollars: 12.5,
    })
    expect(result.current.error).toBe('')
  })

  it('sets error when profile request fails', async () => {
    getCurrentUserMock.mockRejectedValue(new ApiError(500, 'Server error'))

    const { result } = renderHook(() => useCurrentUser(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toBe('The server is unavailable. Please try again later.')
  })

  it('does not fetch when disabled', async () => {
    const { result } = renderHook(() => useCurrentUser({ enabled: false }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(getCurrentUserMock).not.toHaveBeenCalled()
    expect(result.current.user).toBeNull()
  })
})
