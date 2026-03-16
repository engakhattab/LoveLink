import { clsx } from 'clsx'
import type { ElementType, PropsWithChildren } from 'react'

type GlassTone = 'base' | 'elevated'

type GlassCardProps = PropsWithChildren<{
  className?: string
  tone?: GlassTone
  as?: ElementType
}>

export function GlassCard({
  className,
  tone = 'base',
  as,
  children,
}: GlassCardProps) {
  const Component = as ?? 'section'

  return (
    <Component
      className={clsx(
        'rounded-[28px] p-5 shadow-[0_20px_60px_rgba(8,3,25,0.45)] sm:p-7',
        tone === 'elevated' ? 'hekaya-glass-elevated' : 'hekaya-glass',
        className,
      )}
    >
      {children}
    </Component>
  )
}
