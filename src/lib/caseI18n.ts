export function caseNameKey(code: string): string {
  return `cases.${code}.name`
}

export function itemNameKey(code: string): string {
  return `items.${code}.name`
}

export function rarityLabelKey(rarity: string): string {
  return `rarity.${rarity}`
}

export function exteriorLabelKey(exterior: string): string {
  return `exteriors.${exterior}`
}

function humanizeCode(code: string): string {
  return code
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function resolveItemLabel(
  t: (key: string) => string,
  code: string,
  displayName?: string | null,
): string {
  if (displayName && displayName.trim()) return displayName.trim()
  const key = itemNameKey(code)
  const translated = t(key)
  if (translated && translated !== key) return translated
  return humanizeCode(code)
}

export function resolveCaseLabel(
  t: (key: string) => string,
  code: string,
  displayName?: string | null,
): string {
  if (displayName && displayName.trim()) return displayName.trim()
  const key = caseNameKey(code)
  const translated = t(key)
  if (translated && translated !== key) return translated
  return humanizeCode(code)
}

export const RARITY_COLOR: Record<string, string> = {
  MIL_SPEC: '#4b69ff',
  RESTRICTED: '#8847ff',
  CLASSIFIED: '#d32ce6',
  COVERT: '#eb4b4b',
}

export const CASE_ACCENT: Record<string, string> = {
  REVOLUTION_CASE: '#ef4444',
  DREAMS_NIGHTMARES_CASE: '#8b5cf6',
  KILOWATT_CASE: '#eab308',
  RECOIL_CASE: '#f97316',
  FRACTURE_CASE: '#06b6d4',
  SNAKEBITE_CASE: '#22c55e',
  CLUTCH_CASE: '#64748b',
  SPECTRUM_2_CASE: '#ec4899',
  PRISMA_2_CASE: '#a855f7',
  DANGER_ZONE_CASE: '#84cc16',
  CS20_CASE: '#3b82f6',
  OPERATION_BROKEN_FANG_CASE: '#f59e0b',
}

export function caseAccent(code: string): string {
  return CASE_ACCENT[code] ?? '#f59e0b'
}
