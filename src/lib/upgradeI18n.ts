export function upgradeNameKey(code: string): string {
  return `upgrades.${code}.name`
}

export function upgradeDescriptionKey(code: string): string {
  return `upgrades.${code}.description`
}
