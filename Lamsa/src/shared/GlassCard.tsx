import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'

type GlassCardProps = PropsWithChildren<{
  className?: string
}>

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'rounded-[28px] border p-5 sm:p-7',
        'border-[var(--card-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.76),rgba(255,255,255,0.42))]',
        'backdrop-blur-[8px] shadow-[var(--card-shadow)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
