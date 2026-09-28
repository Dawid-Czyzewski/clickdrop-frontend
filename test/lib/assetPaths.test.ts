import { describe, expect, it } from 'vitest'
import {
  CASE_FALLBACK_SRC,
  CASE_IMAGE_CODES,
  caseImageSrc,
  hasCaseImage,
  hasItemImage,
  ITEM_FALLBACK_SRC,
  ITEM_IMAGE_CODES,
  itemImageSrc,
} from '../../src/lib/assetPaths'

describe('assetPaths', () => {
  it('caseImageSrc returns path for known codes and fallback otherwise', () => {
    expect(caseImageSrc('REVOLUTION_CASE')).toBe('/cases/REVOLUTION_CASE.webp')
    expect(caseImageSrc('CLUTCH_CASE')).toBe('/cases/CLUTCH_CASE.webp')
    expect(caseImageSrc('REVOLUTION_CASE')).toBe('/cases/REVOLUTION_CASE.webp')
    expect(caseImageSrc('UNKNOWN')).toBe(CASE_FALLBACK_SRC)
    expect(caseImageSrc('')).toBe(CASE_FALLBACK_SRC)
  })

  it('itemImageSrc returns path for known codes and fallback otherwise', () => {
    expect(itemImageSrc('AK_47_SLATE')).toBe('/items/AK_47_SLATE.webp')
    expect(itemImageSrc('USP_GUARDIAN')).toBe('/items/USP_GUARDIAN.webp')
    expect(itemImageSrc('AK_47_ASIIMOV')).toBe('/items/AK_47_ASIIMOV.webp')
    expect(itemImageSrc('MISSING_SKIN')).toBe(ITEM_FALLBACK_SRC)
    expect(itemImageSrc('')).toBe(ITEM_FALLBACK_SRC)
  })

  it('hasCaseImage / hasItemImage match seed allowlists', () => {
    for (const code of CASE_IMAGE_CODES) {
      expect(hasCaseImage(code)).toBe(true)
    }
    for (const code of ITEM_IMAGE_CODES) {
      expect(hasItemImage(code)).toBe(true)
    }
    expect(hasCaseImage('NOPE')).toBe(false)
    expect(hasItemImage('NOPE')).toBe(false)
  })
})
