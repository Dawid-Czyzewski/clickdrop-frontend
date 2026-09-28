import { act, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LevelUpToast } from '../../src/components/home/LevelUpToast'
import {
  resetSharedCurrentUser,
  setSharedCurrentUser,
  patchSharedCurrentUserStats,
} from '../../src/lib/currentUserStore'
import { resetLevelUpListeners } from '../../src/lib/levelUpStore'
import { renderWithProviders } from '../utils/render'

describe('LevelUpToast', () => {
  beforeEach(() => {
    resetSharedCurrentUser()
    resetLevelUpListeners()
  })

  it('does not show toast on first user load', async () => {
    renderWithProviders(<LevelUpToast />)

    act(() => {
      setSharedCurrentUser({
        username: 'player',
        email: 'player@clickdrop.test',
        level: 3,
        experience: 450,
        clickDollars: 10,
      })
    })

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('shows toast when level increases', async () => {
    renderWithProviders(<LevelUpToast />)

    act(() => {
      setSharedCurrentUser({
        username: 'player',
        email: 'player@clickdrop.test',
        level: 3,
        experience: 450,
        clickDollars: 10,
      })
    })

    act(() => {
      patchSharedCurrentUserStats({ level: 4, experience: 460 })
    })

    expect(await screen.findByRole('status')).toHaveTextContent('Level up! Lvl 4')
  })

  it('does not show toast when only XP increases', async () => {
    renderWithProviders(<LevelUpToast />)

    act(() => {
      setSharedCurrentUser({
        username: 'player',
        email: 'player@clickdrop.test',
        level: 3,
        experience: 450,
        clickDollars: 10,
      })
    })

    act(() => {
      patchSharedCurrentUserStats({ level: 3, experience: 460 })
    })

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })
})
