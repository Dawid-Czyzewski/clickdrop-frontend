'use client'

import { useEffect, useState } from 'react'
import {
  CASE_FALLBACK_SRC,
  caseImageSrc,
  ITEM_FALLBACK_SRC,
  itemImageSrc,
} from '../../lib/assetPaths'

type AssetImageProps = {
  code: string
  alt: string
  kind: 'case' | 'item'
  className?: string
}

export function AssetImage({ code, alt, kind, className = '' }: AssetImageProps) {
  const primary = kind === 'case' ? caseImageSrc(code) : itemImageSrc(code)
  const fallback = kind === 'case' ? CASE_FALLBACK_SRC : ITEM_FALLBACK_SRC
  const [src, setSrc] = useState(primary)

  useEffect(() => {
    setSrc(primary)
  }, [primary])

  return (
    <img
      src={src}
      alt={alt}
      className={`cd-img-fade ${className}`}
      draggable={false}
      onError={() => {
        if (src !== fallback) setSrc(fallback)
      }}
    />
  )
}
