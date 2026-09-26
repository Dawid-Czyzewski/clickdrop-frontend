export const CASE_IMAGE_CODES = [
  'ANVIL',
  'TEMPER',
  'FORGEFIRE',
  'EMBER',
  'NOVA',
  'RIFT',
  'PULSE',
  'SHADOW',
] as const

export const ITEM_IMAGE_CODES = [
  'GLOCK_WATER_ELEMENTAL',
  'USP_GUARDIAN',
  'AK_REDLINE',
  'AWP_ELECTRIC_HIVE',
  'M4A4_DESERT_STRIKE',
  'AWP_ASIIMOV',
] as const

export type CaseImageCode = (typeof CASE_IMAGE_CODES)[number]
export type ItemImageCode = (typeof ITEM_IMAGE_CODES)[number]

const CASE_SET = new Set<string>(CASE_IMAGE_CODES)
const ITEM_SET = new Set<string>(ITEM_IMAGE_CODES)

export const CASE_FALLBACK_SRC = '/cases/_fallback.webp'
export const ITEM_FALLBACK_SRC = '/items/_fallback.webp'

export function hasCaseImage(code: string): boolean {
  return CASE_SET.has(code)
}

export function hasItemImage(code: string): boolean {
  return ITEM_SET.has(code)
}

export function caseImageSrc(code: string): string {
  if (!code || !hasCaseImage(code)) return CASE_FALLBACK_SRC
  return `/cases/${code}.webp`
}

export function itemImageSrc(code: string): string {
  if (!code || !hasItemImage(code)) return ITEM_FALLBACK_SRC
  return `/items/${code}.webp`
}
