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

export const RARITY_COLOR: Record<string, string> = {
  MIL_SPEC: '#4b69ff',
  RESTRICTED: '#8847ff',
  CLASSIFIED: '#d32ce6',
  COVERT: '#eb4b4b',
}

export const CASE_ACCENT: Record<string, string> = {
  ANVIL: '#f59e0b',
  TEMPER: '#fbbf24',
  FORGEFIRE: '#ea580c',
  EMBER: '#dc2626',
  NOVA: '#38bdf8',
  RIFT: '#a78bfa',
  PULSE: '#34d399',
  SHADOW: '#64748b',
}
