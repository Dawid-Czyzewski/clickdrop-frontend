import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearPendingVerificationEmail,
  getPendingVerificationEmail,
  setPendingVerificationEmail,
} from '../../src/auth/pendingVerification'

describe('pendingVerification', () => {
  beforeEach(() => {
    clearPendingVerificationEmail()
  })

  it('stores and reads trimmed email', () => {
    setPendingVerificationEmail('  player@clickdrop.test  ')
    expect(getPendingVerificationEmail()).toBe('player@clickdrop.test')
  })

  it('clears stored email', () => {
    setPendingVerificationEmail('player@clickdrop.test')
    clearPendingVerificationEmail()
    expect(getPendingVerificationEmail()).toBeNull()
  })
})
