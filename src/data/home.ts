export type StatItem = {
  id: string
  labelKey: string
  value: string
}

export const STATS: StatItem[] = [
  { id: 'cases', labelKey: 'home.stats.cases', value: '48 291' },
  { id: 'upgrades', labelKey: 'home.stats.upgrades', value: '12 044' },
  { id: 'battles', labelKey: 'home.stats.battles', value: '3 812' },
  { id: 'contracts', labelKey: 'home.stats.contracts', value: '9 560' },
  { id: 'players', labelKey: 'home.stats.players', value: '21 307' },
]
