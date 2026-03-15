import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'

type AccentTone = 'neutral' | 'rose' | 'gold'

type GlassPanelProps = PropsWithChildren<{
  className?: string
  accent?: AccentTone
}>

const ACCENT_CLASSES: Record<AccentTone, string> = {
  neutral:
    'bg-[linear-gradient(160deg,var(--bg-card),rgba(18,8,28,0.86))] border-[var(--panel-border)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
  rose: 'bg-[linear-gradient(160deg,rgba(54,18,56,0.86),rgba(30,8,41,0.9))] border-[rgba(255,90,166,0.42)] shadow-[inset_0_1px_0_rgba(255,140,190,0.12)]',
  gold: 'bg-[linear-gradient(160deg,var(--bg-card-gold),rgba(35,18,14,0.88))] border-[rgba(255,190,85,0.45)] shadow-[inset_0_1px_0_rgba(255,210,120,0.1)]',
}

export function GlassPanel({
  className,
  accent = 'neutral',
  children,
}: GlassPanelProps) {
  return (
    <div
      className={clsx(
        'rounded-[28px] border p-5 shadow-[var(--shadow-glow)] backdrop-blur-[8px] sm:p-7',
        ACCENT_CLASSES[accent],
        className,
      )}
    >
      {children}
    </div>
  )
}
