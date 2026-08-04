import { useEffect } from 'react'

type PageSeoProps = {
  title: string
  description: string
  path?: string
  noIndex?: boolean
  lang?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function PageSeo({
  title,
  description,
  path = '/',
  noIndex = false,
  lang = 'en',
}: PageSeoProps) {
  useEffect(() => {
    const origin = window.location.origin
    const url = `${origin}${path}`

    document.title = title
    document.documentElement.lang = lang.startsWith('pl') ? 'pl' : 'en'

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('name', 'theme-color', '#0a0b0f')

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', 'ClickDrop')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:locale', lang.startsWith('pl') ? 'pl_PL' : 'en_US')

    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    upsertLink('canonical', url)
  }, [title, description, path, noIndex, lang])

  return null
}
