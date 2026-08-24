import { useId } from 'react'

type CasePlaceholderProps = {
  accent?: string
  className?: string
}

export function CasePlaceholder({ accent = '#f59e0b', className = '' }: CasePlaceholderProps) {
  const id = useId().replace(/:/g, '')
  const gradId = `case-body-${id}`

  return (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="20" y1="30" x2="140" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor={accent} stopOpacity="0.9" />
          <stop offset="1" stopColor="#1a1208" />
        </linearGradient>
      </defs>
      <rect x="28" y="48" width="104" height="72" rx="8" fill={`url(#${gradId})`} stroke={accent} strokeWidth="2" />
      <path
        d="M40 48V38c0-8 8-14 40-14s40 6 40 14v10"
        stroke={accent}
        strokeWidth="2.5"
        fill="rgba(0,0,0,0.35)"
      />
      <rect x="68" y="72" width="24" height="18" rx="3" fill="#0a0b0f" stroke={accent} strokeWidth="1.5" />
      <circle cx="80" cy="81" r="3" fill={accent} />
      <path d="M48 58h64" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  )
}
