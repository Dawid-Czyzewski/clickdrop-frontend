import { describe, expect, it } from 'vitest'
import { absoluteUrl, buildPageMetadata, publicSitemapPaths } from '../../src/seo/site'

describe('seo site metadata', () => {
  it('builds indexable home metadata with canonical and open graph', () => {
    const metadata = buildPageMetadata('home')

    expect(metadata.title).toBe('ClickDrop — Open cases. Drop rare skins.')
    expect(metadata.description).toContain('gaming case-opening')
    expect(metadata.alternates).toEqual(
      expect.objectContaining({
        canonical: absoluteUrl('/'),
      }),
    )
    expect(metadata.robots).toEqual(expect.objectContaining({ index: true, follow: true }))
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        title: 'ClickDrop — Open cases. Drop rare skins.',
        url: absoluteUrl('/'),
        siteName: 'ClickDrop',
      }),
    )
  })

  it('marks auth pages as noindex', () => {
    expect(buildPageMetadata('login').robots).toEqual(
      expect.objectContaining({ index: false, follow: false }),
    )
    expect(buildPageMetadata('register').robots).toEqual(
      expect.objectContaining({ index: false, follow: false }),
    )
  })

  it('includes only public paths in sitemap list', () => {
    expect(publicSitemapPaths).toEqual(['/'])
  })
})
