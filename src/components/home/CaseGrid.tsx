import { useTranslation } from 'react-i18next'
import { CASES } from '../../data/home'
import { CaseCard } from './CaseCard'

export function CaseGrid() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="cases-heading">
      <h2 id="cases-heading" className="mb-4 font-display text-sm font-medium tracking-[0.2em] text-cd-muted uppercase">
        {t('home.cases.heading')}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {CASES.map((item) => (
          <CaseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
