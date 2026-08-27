import { useTranslation } from 'react-i18next'
import { PageSeo } from '../components/PageSeo'
import { CaseGrid } from '../components/home/CaseGrid'
import { EventHero } from '../components/home/EventHero'
import { LiveFeed } from '../components/home/LiveFeed'
import { MainNav } from '../components/home/MainNav'
import { SiteHeader } from '../components/home/SiteHeader'
import { StatsBar } from '../components/home/StatsBar'

export function HomePage() {
  const { t, i18n } = useTranslation()

  return (
    <div className="min-h-svh bg-cd-bg text-cd-text">
      <PageSeo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        path="/"
        lang={i18n.language}
      />
      <SiteHeader />
      <MainNav />
      <StatsBar />

      <div className="flex w-full">
        <LiveFeed />
        <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
          <div className="mb-8">
            <EventHero />
          </div>
          <CaseGrid />
        </main>
      </div>
    </div>
  )
}
