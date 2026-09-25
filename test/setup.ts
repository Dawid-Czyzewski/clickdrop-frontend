/// <reference types="@testing-library/jest-dom/vitest" />
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { resetSharedBalance } from '../src/lib/balanceStore'
import './mocks/nextNavigation'

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
  resetSharedBalance()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
