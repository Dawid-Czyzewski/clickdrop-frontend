export type CaseItem = {
  id: string
  nameKey: string
  price: string
  accent: string
  featured?: boolean
}

export type LiveDrop = {
  id: string
  name: string
  wear: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export type StatItem = {
  id: string
  labelKey: string
  value: string
}

export const CASES: CaseItem[] = [
  { id: 'anvil', nameKey: 'home.cases.anvil', price: '$ 0.50', accent: '#f59e0b', featured: true },
  { id: 'temper', nameKey: 'home.cases.temper', price: '$ 0.99', accent: '#fbbf24', featured: true },
  { id: 'forgefire', nameKey: 'home.cases.forgefire', price: '$ 1.49', accent: '#ea580c' },
  { id: 'ember', nameKey: 'home.cases.ember', price: '$ 2.00', accent: '#dc2626' },
  { id: 'nova', nameKey: 'home.cases.nova', price: '$ 0.75', accent: '#38bdf8' },
  { id: 'rift', nameKey: 'home.cases.rift', price: '$ 3.50', accent: '#a78bfa' },
  { id: 'pulse', nameKey: 'home.cases.pulse', price: '$ 1.25', accent: '#34d399' },
  { id: 'shadow', nameKey: 'home.cases.shadow', price: '$ 4.00', accent: '#64748b' },
]

export const LIVE_DROPS: LiveDrop[] = [
  { id: '1', name: 'Slag', wear: 'FT', rarity: 'rare' },
  { id: '2', name: 'Army Sheen', wear: 'BS', rarity: 'common' },
  { id: '3', name: 'Nightfall', wear: 'MW', rarity: 'epic' },
  { id: '4', name: 'Carbon', wear: 'WW', rarity: 'common' },
  { id: '5', name: 'Gold Rush', wear: 'FN', rarity: 'legendary' },
  { id: '6', name: 'Voltage', wear: 'FT', rarity: 'rare' },
  { id: '7', name: 'Phantom', wear: 'MW', rarity: 'epic' },
  { id: '8', name: 'Rustline', wear: 'BS', rarity: 'common' },
  { id: '9', name: 'Apex', wear: 'FN', rarity: 'legendary' },
  { id: '10', name: 'Hive', wear: 'FT', rarity: 'rare' },
]

export const STATS: StatItem[] = [
  { id: 'cases', labelKey: 'home.stats.cases', value: '48 291' },
  { id: 'upgrades', labelKey: 'home.stats.upgrades', value: '12 044' },
  { id: 'battles', labelKey: 'home.stats.battles', value: '3 812' },
  { id: 'contracts', labelKey: 'home.stats.contracts', value: '9 560' },
  { id: 'players', labelKey: 'home.stats.players', value: '21 307' },
]

export const RARITY_COLOR: Record<LiveDrop['rarity'], string> = {
  common: '#8b92a5',
  rare: '#38bdf8',
  epic: '#a78bfa',
  legendary: '#f59e0b',
}
