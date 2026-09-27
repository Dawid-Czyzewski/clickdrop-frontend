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
          itemCode: 'AK_REDLINE',
          rarity: 'RESTRICTED',
          exterior: 'FIELD_TESTED',
          suggestedSellPrice: 40,
        },
        successChance: 0.5,
        possibleTargets: [
          {
            itemId: 6,
            itemCode: 'AWP_ASIIMOV',
            rarity: 'COVERT',
            suggestedSellPrice: 200,
          },
        ],
      },
    })

    const preview = await getSkinUpgradePreview(9)

    expect(preview.successChance).toBe(0.5)
    expect(preview.possibleTargets[0]?.itemCode).toBe('AWP_ASIIMOV')
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
        itemCode: 'AWP_ASIIMOV',
        rarity: 'COVERT',
        exterior: 'FACTORY_NEW',
        suggestedSellPrice: 220,
      },
    })

    const win = await upgradeSkin(9)
    expect(isSkinUpgradeSuccess(win)).toBe(true)
    if (isSkinUpgradeSuccess(win)) {
      expect(win.itemCode).toBe('AWP_ASIIMOV')
    }

    requestMock.mockResolvedValueOnce({ data: { result: 'FAIL' } })
    const lose = await upgradeSkin(9)
    expect(isSkinUpgradeSuccess(lose)).toBe(false)
    expect(requestMock).toHaveBeenLastCalledWith({
      url: '/api/economy/inventory/9/upgrade',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
