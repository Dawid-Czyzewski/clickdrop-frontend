import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { clearAuthUser, getAuthUser } from '../auth/session'
import { PageSeo } from '../components/PageSeo'

export function DashboardPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const user = getAuthUser()

  function handleLogout() {
    clearAuthUser()
    navigate('/login', { replace: true })
  }

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-cd-bg px-4 py-10 text-cd-text sm:px-6">
      <PageSeo
        title={t('seo.dashboard.title')}
        description={t('seo.dashboard.description')}
        path="/dashboard"
        noIndex
        lang={i18n.language}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div
        className="cd-glow pointer-events-none absolute -top-1/4 left-1/2 h-[50vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-cd-accent/15 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm tracking-[0.2em] text-cd-accent uppercase">
              ClickDrop
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-wide sm:text-3xl">
              {t('dashboard.title')}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-md border border-cd-border bg-cd-surface px-4 py-2 text-sm font-medium text-cd-text transition hover:bg-cd-surface-hover"
          >
            {t('dashboard.logout')}
          </button>
        </header>

        <section className="rounded-lg border border-cd-border bg-cd-surface/90 p-6 backdrop-blur-sm sm:p-8">
          <p className="text-cd-muted">{t('dashboard.welcome')}</p>
          {user ? (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium tracking-wider text-cd-muted uppercase">
                  {t('dashboard.email')}
                </dt>
                <dd className="mt-1 text-lg text-cd-text">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wider text-cd-muted uppercase">
                  {t('dashboard.role')}
                </dt>
                <dd className="mt-1 text-lg text-cd-accent">{user.role}</dd>
              </div>
            </dl>
          ) : null}
        </section>
      </div>
    </main>
  )
}
