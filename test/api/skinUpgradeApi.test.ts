import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getSkinUpgradePreview,
  isSkinUpgradeSuccess,
  skinUpgradeApi,
  upgradeSkin,
} from '../../src/api/skinUpgradeApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('skinUpgradeApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('getSkinUpgradePreview calls GET upgrade-preview', async () => {
    requestMock.mockResolvedValue({
      data: {
        inventoryItemId: 9,
        current: {
          itemCode: 'AK_47_SLATE',
          itemDisplayName: 'AK-47 | Slate',
          rarity: 'RESTRICTED',
          exterior: 'FIELD_TESTED',
          suggestedSellPrice: 40,
        },
        successChance: 0.5,
        possibleTargets: [
          {
            itemId: 6,
            itemCode: 'AK_47_ASIIMOV',
            itemDisplayName: 'AK-47 | Asiimov',
            rarity: 'COVERT',
            exterior: 'MINIMAL_WEAR',
            floatValue: 0.25,
            paintSeed: 123,
            suggestedSellPrice: 200,
          },
        ],
      },
    })

    const preview = await getSkinUpgradePreview(9)

    expect(preview.successChance).toBe(0.5)
    expect(preview.possibleTargets[0]?.itemCode).toBe('AK_47_ASIIMOV')
    expect(skinUpgradeApi.getSkinUpgradePreview).toBe(getSkinUpgradePreview)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/inventory/9/upgrade-preview',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })

  it('upgradeSkin parses SUCCESS and FAIL results', async () => {
    requestMock.mockResolvedValueOnce({
      data: {
        result: 'SUCCESS',
        inventoryItemId: 12,
        itemCode: 'AK_47_ASIIMOV',
        itemDisplayName: 'AK-47 | Asiimov',
        rarity: 'COVERT',
        exterior: 'FACTORY_NEW',
        floatValue: 0.25,
        paintSeed: 123,
        suggestedSellPrice: 220,
      },
    })

    const win = await upgradeSkin(9, {
      targetItemId: 6,
      targetExterior: 'FACTORY_NEW',
    })
    expect(isSkinUpgradeSuccess(win)).toBe(true)
    if (isSkinUpgradeSuccess(win)) {
      expect(win.itemCode).toBe('AK_47_ASIIMOV')
    }

    requestMock.mockResolvedValueOnce({ data: { result: 'FAIL' } })
    const lose = await upgradeSkin(9, {
      targetItemId: 6,
      targetExterior: 'MINIMAL_WEAR',
    })
    expect(isSkinUpgradeSuccess(lose)).toBe(false)
    expect(requestMock).toHaveBeenLastCalledWith({
      url: '/api/economy/inventory/9/upgrade',
      method: 'POST',
      data: { targetItemId: 6, targetExterior: 'MINIMAL_WEAR' },
      headers: undefined,
      skipAuth: false,
    })
  })
})
