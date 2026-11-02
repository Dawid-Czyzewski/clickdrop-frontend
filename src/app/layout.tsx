import type { Metadata, Viewport } from 'next'
import { DocumentLang } from '../components/DocumentLang'
import { I18nProvider } from '../i18n/I18nProvider'
import { buildPageMetadata, getSiteOrigin } from '../seo/site'
import '../index.css'

const home = buildPageMetadata('home')

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: 'ClickDrop',
    template: '%s',
  },
  description: home.description,
  applicationName: 'ClickDrop',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'ClickDrop',
    locale: 'en_US',
    alternateLocale: ['pl_PL'],
  },
  twitter: {
    card: 'summary',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0b0f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <I18nProvider>
          <DocumentLang />
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
