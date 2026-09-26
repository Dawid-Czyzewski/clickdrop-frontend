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
    expect(caseImageSrc('ANVIL')).toBe('/cases/ANVIL.webp')
    expect(caseImageSrc('SHADOW')).toBe('/cases/SHADOW.webp')
    expect(caseImageSrc('UNKNOWN')).toBe(CASE_FALLBACK_SRC)
    expect(caseImageSrc('')).toBe(CASE_FALLBACK_SRC)
  })

  it('itemImageSrc returns path for known codes and fallback otherwise', () => {
    expect(itemImageSrc('AK_REDLINE')).toBe('/items/AK_REDLINE.webp')
    expect(itemImageSrc('AWP_ASIIMOV')).toBe('/items/AWP_ASIIMOV.webp')
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
