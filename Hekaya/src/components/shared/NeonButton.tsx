import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

type NeonButtonVariant = 'primary' | 'gold'

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: NeonButtonVariant
  wide?: boolean
}

export function NeonButton({
  className,
  type = 'button',
  variant = 'primary',
  wide = true,
  ...rest
}: NeonButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold tracking-[0.13em] uppercase transition duration-300',
        'hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary'
          ? [
              'border-[rgba(217,70,239,0.52)] text-[var(--hekaya-text-primary)]',
              'bg-[linear-gradient(140deg,var(--hekaya-neon-glow),var(--hekaya-neon-primary),var(--hekaya-neon-soft))]',
              'shadow-[0_16px_34px_rgba(217,70,239,0.35)] hover:shadow-[0_20px_40px_rgba(217,70,239,0.44)]',
            ]
          : [
              'border-[rgba(251,191,36,0.6)] text-[#2a1a02]',
              'bg-[linear-gradient(140deg,var(--hekaya-gold-glow),var(--hekaya-gold),#fcd34d)]',
              'shadow-[0_16px_34px_rgba(251,191,36,0.32)] hover:shadow-[0_20px_40px_rgba(251,191,36,0.4)]',
            ],
        wide ? 'w-full' : '',
        className,
      )}
      {...rest}
    />
  )
}
