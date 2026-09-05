import type { MetadataRoute } from 'next'
import { absoluteUrl, publicSitemapPaths } from '../seo/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return publicSitemapPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
