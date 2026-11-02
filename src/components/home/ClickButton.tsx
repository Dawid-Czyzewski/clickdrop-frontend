'use client'

import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ClickButtonProps = {
  disabled?: boolean
  busy?: boolean
  onClick?: () => void
}

function DollarBadge() {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-cd-bg sm:h-11 sm:w-11"
      aria-hidden="true"
    >
      <span className="font-display text-xl font-bold leading-none text-cd-bg sm:text-2xl">$</span>
    </span>
  )
}

function PulseRings({ gradientId }: { gradientId: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="150" fill={`url(#${gradientId})`} />
      <circle
        cx="160"
        cy="160"
        r="118"
        fill="none"
        stroke="#f59e0b"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="4 10"
      />
      <circle
        cx="160"
        cy="160"
        r="138"
        fill="none"
        stroke="#f59e0b"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeDasharray="3 12"
      />
      <circle
        cx="160"
        cy="160"
        r="155"
        fill="none"
        stroke="#f59e0b"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="2 14"
      />
    </svg>
  )
}

const idleShadow = '0 14px 0 #9a3412, 0 18px 28px rgba(0,0,0,0.45)'
const hoverShadow = '0 18px 0 #9a3412, 0 24px 36px rgba(0,0,0,0.5)'
const pressedShadow = '0 4px 0 #9a3412, 0 8px 16px rgba(0,0,0,0.4)'

export function ClickButton({ disabled = false, busy = false, onClick }: ClickButtonProps) {
  const { t } = useTranslation()
  const [pressed, setPressed] = useState(false)
  const ringsGradientId = useId().replace(/:/g, '')

  return (
    <div className="relative flex w-[min(72vw,17.5rem)] items-center justify-center overflow-hidden py-6 sm:w-[19rem] sm:py-8">
      <PulseRings gradientId={`cd-pulse-${ringsGradientId}`} />

      <button
        type="button"
        disabled={disabled}
        aria-busy={busy || undefined}
        aria-label={t('home.earn.clickLabel')}
        onClick={onClick}
        onPointerDown={() => {
          if (!disabled) setPressed(true)
        }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={[
          'relative z-10 flex aspect-square w-[min(58vw,15.5rem)] cursor-pointer flex-col items-center justify-center gap-3 rounded-full',
          'border border-[#c2410c]/40 outline-none transition-[transform,box-shadow,filter] duration-150',
          'focus-visible:ring-2 focus-visible:ring-cd-accent-hover focus-visible:ring-offset-2 focus-visible:ring-offset-cd-bg',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'sm:w-[17.5rem]',
          pressed && !disabled
            ? 'cd-click-btn-pressed translate-y-3'
            : 'hover:-translate-y-1 hover:brightness-105 active:translate-y-3',
        ].join(' ')}
        style={{
          background:
            'radial-gradient(circle at 50% 38%, #ffb020 0%, #f59e0b 48%, #ea580c 100%)',
          boxShadow: pressed && !disabled ? pressedShadow : idleShadow,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !pressed) e.currentTarget.style.boxShadow = hoverShadow
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = idleShadow
          setPressed(false)
        }}
      >
        <span
          className="pointer-events-none absolute inset-[10px] rounded-full border border-black/20 sm:inset-[12px]"
          aria-hidden="true"
        />
        <DollarBadge />
        <span className="px-4 text-center font-display text-[0.7rem] font-bold tracking-[0.16em] text-cd-bg uppercase sm:text-sm">
          {t('home.earn.clickLabel')}
        </span>
      </button>
    </div>
  )
}
