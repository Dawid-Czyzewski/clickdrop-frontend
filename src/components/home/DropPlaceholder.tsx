type DropPlaceholderProps = {
  color?: string
  className?: string
}

export function DropPlaceholder({ color = '#8b92a5', className = '' }: DropPlaceholderProps) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="14" width="40" height="12" rx="2" fill={color} fillOpacity="0.85" />
      <path d="M44 16h12l4 4-4 4H44V16Z" fill={color} />
      <rect x="10" y="10" width="8" height="4" rx="1" fill={color} fillOpacity="0.5" />
      <circle cx="18" cy="20" r="2" fill="#0a0b0f" />
    </svg>
  )
}
