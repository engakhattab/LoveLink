import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

type GlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  wide?: boolean
}

export function GlowButton({
  className,
  type = 'button',
  wide = true,
  ...rest
}: GlowButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold tracking-[0.14em] uppercase',
        'border-[rgba(255,188,96,0.45)] text-[#fff6fb]',
        'bg-[linear-gradient(140deg,var(--rose-deep),var(--rose-main),#ff79bc)]',
        'shadow-[0_15px_36px_rgba(255,60,149,0.35)] transition duration-300',
        'hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55',
        wide ? 'w-full' : '',
        className,
      )}
      {...rest}
    />
  )
}
