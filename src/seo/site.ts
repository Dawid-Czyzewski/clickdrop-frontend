import type { Metadata } from 'next'
import en from '../i18n/locales/en.json'
import pl from '../i18n/locales/pl.json'

export type SeoPageKey =
  | 'home'
  | 'login'
  | 'register'
  | 'verifyEmail'
  | 'forgotPassword'
  | 'resetPassword'
  | 'upgrades'
  | 'inventory'
  | 'daily'
  | 'skinUpgrade'
  | 'caseOpens'
  | 'leaderboard'

const seoPages: Record<
  SeoPageKey,
  { path: string; noIndex?: boolean }
> = {
  home: { path: '/' },
  daily: { path: '/daily' },
  upgrades: { path: '/upgrades' },
  inventory: { path: '/inventory' },
  skinUpgrade: { path: '/skin-upgrade' },
  caseOpens: { path: '/cases/opens' },
  leaderboard: { path: '/leaderboard' },
  login: { path: '/login', noIndex: true },
  register: { path: '/register', noIndex: true },
  verifyEmail: { path: '/verify-email', noIndex: true },
  forgotPassword: { path: '/forgot-password', noIndex: true },
  resetPassword: { path: '/reset-password', noIndex: true },
}

export function getSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin()
  if (path === '/') return origin
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildPageMetadata(page: SeoPageKey): Metadata {
  const { path, noIndex } = seoPages[page]
  const title = en.seo[page].title
  const description = en.seo[page].description
  const url = absoluteUrl(path)

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        pl: url,
        'x-default': url,
      },
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'ClickDrop',
      title,
      description,
      url,
      locale: 'en_US',
      alternateLocale: ['pl_PL'],
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    other: {
      'og:locale:alternate': 'pl_PL',
    },
  }
}

export const seoCopy = {
  en: en.seo,
  pl: pl.seo,
} as const

export const publicSitemapPaths = Object.values(seoPages)
  .filter((page) => !page.noIndex)
  .map((page) => page.path)
