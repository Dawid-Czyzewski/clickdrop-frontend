/// <reference types="@testing-library/jest-dom/vitest" />
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { resetSharedBalance } from '../src/lib/balanceStore'
import { resetSharedCurrentUser } from '../src/lib/currentUserStore'
import { resetLevelUpListeners } from '../src/lib/levelUpStore'
import './mocks/nextNavigation'

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
  resetSharedBalance()
  resetSharedCurrentUser()
  resetLevelUpListeners()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
