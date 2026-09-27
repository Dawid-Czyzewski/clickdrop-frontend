type CurrencyBadgeProps = {
  className?: string
  size?: 'sm' | 'md'
}

export function CurrencyBadge({ className = '', size = 'sm' }: CurrencyBadgeProps) {
  const dim = size === 'md' ? 'h-6 w-6 text-sm' : 'h-5 w-5 text-xs'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-cd-accent font-display font-bold text-cd-bg ${dim} ${className}`}
      aria-hidden="true"
    >
      $
    </span>
  )
}
