import type { RecentDrop } from '../api/dropsApi'

export function recentDropHref(
  drop: Pick<RecentDrop, 'caseId' | 'source'>,
  resolvedCaseId?: number,
): string {
  const caseId = resolvedCaseId ?? drop.caseId
  if (caseId != null && Number.isFinite(caseId) && caseId > 0) {
    return `/cases/${caseId}`
  }
  if (drop.source === 'DAILY') return '/daily'
  return '/#cases'
}
