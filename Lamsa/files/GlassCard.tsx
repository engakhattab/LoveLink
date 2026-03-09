import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'

type GlassCardProps = PropsWithChildren<{
  className?: string
  accent?: boolean
}>

export function GlassCard({ className, accent = false, children }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'rounded-[28px] border p-5 sm:p-7',
        accent
          ? 'border-[var(--card-border-accent)] bg-[linear-gradient(160deg,rgba(255,255,255,0.88),rgba(255,220,235,0.55))]'
          : 'border-[var(--card-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.86),rgba(255,210,229,0.48))]',
        'backdrop-blur-[10px] shadow-[var(--card-shadow)]',
        'transition-shadow duration-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
