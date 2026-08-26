const PENDING_VERIFICATION_EMAIL_KEY = 'clickdrop_pending_verification_email'

export function getPendingVerificationEmail(): string | null {
  const email = sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)?.trim()
  return email || null
}

export function setPendingVerificationEmail(email: string): void {
  sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email.trim())
}

export function clearPendingVerificationEmail(): void {
  sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY)
}
