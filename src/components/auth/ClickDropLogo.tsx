type ClickDropLogoProps = {
  className?: string
}

export function ClickDropLogo({ className = '' }: ClickDropLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-14 w-14 sm:h-16 sm:w-16"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cd-logo-grad" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path
          d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
          stroke="url(#cd-logo-grad)"
          strokeWidth="2.5"
          fill="rgba(245, 158, 11, 0.08)"
        />
        <path
          d="M32 14L22 36H30L28 50L42 28H34L36 14H32Z"
          fill="url(#cd-logo-grad)"
        />
      </svg>
      <span className="font-display text-2xl font-semibold tracking-[0.12em] text-cd-text sm:text-3xl">
        CLICK<span className="text-cd-accent">DROP</span>
      </span>
    </div>
  )
}
