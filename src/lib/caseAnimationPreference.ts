const SKIP_CASE_ANIMATION_KEY = 'clickdrop_skip_case_animation'

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function getSkipCaseAnimationPreference(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SKIP_CASE_ANIMATION_KEY) === '1'
}

export function setSkipCaseAnimationPreference(skip: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SKIP_CASE_ANIMATION_KEY, skip ? '1' : '0')
}

export function shouldSkipCaseSpin(): boolean {
  return prefersReducedMotion() || getSkipCaseAnimationPreference()
}
