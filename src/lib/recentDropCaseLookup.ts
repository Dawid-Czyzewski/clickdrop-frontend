import { getCaseDrops, getCases } from '../api/casesApi'
import type { RecentDrop } from '../api/dropsApi'

export type CaseLookup = {
  idByCode: Map<string, number>
  idByItemCode: Map<string, number>
}

export function resolveCaseIdFromLookup(
  drop: Pick<RecentDrop, 'caseId' | 'caseCode' | 'itemCode' | 'source'>,
  lookup: CaseLookup | null,
): number | undefined {
  if (drop.caseId != null && Number.isFinite(drop.caseId) && drop.caseId > 0) {
    return drop.caseId
  }
  if (drop.source !== 'CASE' || !lookup) return undefined
  if (drop.caseCode) {
    const byCode = lookup.idByCode.get(drop.caseCode)
    if (byCode != null) return byCode
  }
  return lookup.idByItemCode.get(drop.itemCode)
}

export async function fetchCaseLookup(): Promise<CaseLookup> {
  const cases = await getCases()
  const idByCode = new Map(cases.map((c) => [c.code, c.id]))
  const pools = await Promise.all(
    cases.map(async (c) => ({ caseId: c.id, drops: await getCaseDrops(c.id) })),
  )
  const idByItemCode = new Map<string, number>()
  for (const { caseId, drops } of pools) {
    for (const drop of drops) {
      if (!idByItemCode.has(drop.code)) idByItemCode.set(drop.code, caseId)
    }
  }
  return { idByCode, idByItemCode }
}
