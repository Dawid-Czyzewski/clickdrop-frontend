import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const EVENT_END = Date.now() + 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 11

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function EventHero() {
  const { t } = useTranslation()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const remaining = Math.max(0, EVENT_END - now)
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
  const mins = Math.floor((remaining / (1000 * 60)) % 60)
  const secs = Math.floor((remaining / 1000) % 60)

  const units = [
    { label: t('home.hero.days'), value: pad(days) },
    { label: t('home.hero.hours'), value: pad(hours) },
    { label: t('home.hero.mins'), value: pad(mins) },
    { label: t('home.hero.secs'), value: pad(secs) },
  ]

  return (
    <section
      className="cd-fade-in relative overflow-hidden rounded-lg border border-cd-border"
      aria-labelledby="home-hero-title"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(245,158,11,0.28), transparent 55%), linear-gradient(135deg, #1a1208 0%, #0a0b0f 45%, #12141c 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Decorative placeholder art */}
      <div className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 sm:block lg:right-10" aria-hidden="true">
        <svg viewBox="0 0 220 180" className="h-36 w-44 opacity-90 lg:h-44 lg:w-56">
          <ellipse cx="110" cy="150" rx="70" ry="12" fill="#f59e0b" fillOpacity="0.15" />
          <path d="M70 130 L110 40 L150 130 Z" fill="#f59e0b" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="2" />
          <rect x="95" y="70" width="30" height="50" rx="4" fill="#fbbf24" fillOpacity="0.35" stroke="#f59e0b" />
          <circle cx="110" cy="55" r="14" fill="#fbbf24" fillOpacity="0.5" stroke="#f59e0b" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-5 px-5 py-8 sm:max-w-[60%] sm:px-8 sm:py-10">
        <p className="font-display text-xs tracking-[0.25em] text-cd-accent uppercase">
          {t('home.hero.eyebrow')}
        </p>
        <h1 id="home-hero-title" className="font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl lg:text-4xl">
          {t('home.hero.title')}
        </h1>
        <p className="max-w-md text-base text-cd-muted">{t('home.hero.subtitle')}</p>

        <div className="flex flex-wrap gap-3" aria-label={t('home.hero.countdown')}>
          {units.map((unit) => (
            <div
              key={unit.label}
              className="min-w-[3.5rem] rounded-md border border-cd-border bg-cd-bg/70 px-2.5 py-2 text-center"
            >
              <div className="font-display text-xl font-semibold tabular-nums text-cd-accent">{unit.value}</div>
              <div className="text-[10px] tracking-wider text-cd-muted uppercase">{unit.label}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-fit cursor-pointer rounded-md bg-cd-accent px-5 py-2.5 font-display text-xs font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover"
        >
          {t('home.hero.cta')}
        </button>
      </div>
    </section>
  )
}
