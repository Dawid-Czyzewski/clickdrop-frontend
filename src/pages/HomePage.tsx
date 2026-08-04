import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageSeo } from '../components/PageSeo'

export function HomePage() {
  const { t, i18n } = useTranslation()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center text-slate-900">
      <PageSeo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        path="/"
        lang={i18n.language}
      />
      <div className="flex gap-2" role="group" aria-label={t('language.label')}>
        <button
          type="button"
          onClick={() => void i18n.changeLanguage('pl')}
          className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition ${
            i18n.language.startsWith('pl')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
          }`}
        >
          {t('language.pl')}
        </button>
        <button
          type="button"
          onClick={() => void i18n.changeLanguage('en')}
          className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition ${
            i18n.language.startsWith('en')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
          }`}
        >
          {t('language.en')}
        </button>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {t('app.title')}
      </h1>
      <p className="max-w-md text-base text-slate-600">{t('app.subtitle')}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/login"
          className="cursor-pointer rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {t('app.cta')}
        </Link>
      </div>
    </main>
  )
}
