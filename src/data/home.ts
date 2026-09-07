export type CaseItem = {
  id: string
  nameKey: string
  price: string
  accent: string
  featured?: boolean
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

export const STATS: StatItem[] = [
  { id: 'cases', labelKey: 'home.stats.cases', value: '48 291' },
  { id: 'upgrades', labelKey: 'home.stats.upgrades', value: '12 044' },
  { id: 'battles', labelKey: 'home.stats.battles', value: '3 812' },
  { id: 'contracts', labelKey: 'home.stats.contracts', value: '9 560' },
  { id: 'players', labelKey: 'home.stats.players', value: '21 307' },
]
