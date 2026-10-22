'use client'

import Link from 'next/link'
import { cdBodyMuted, cdBtnGhost, cdBtnPrimary, cdBtnPrimaryLink } from './uiStyles'

type EmptyStateProps = {
  message: string
  ctaLabel: string
  ctaHref?: string
  onCtaClick?: () => void
  secondaryLabel?: string
  secondaryHref?: string
}

export function EmptyState({
  message,
  ctaLabel,
  ctaHref,
  onCtaClick,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className={cdBodyMuted}>{message}</p>
      <div className="flex flex-wrap gap-2">
        {ctaHref ? (
          <Link href={ctaHref} className={cdBtnPrimaryLink}>
            {ctaLabel}
          </Link>
        ) : (
          <button type="button" onClick={onCtaClick} className={cdBtnPrimary}>
            {ctaLabel}
          </button>
        )}
        {secondaryLabel && secondaryHref ? (
          <Link href={secondaryHref} className={cdBtnGhost}>
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
