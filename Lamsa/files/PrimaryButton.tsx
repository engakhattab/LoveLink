import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({
  className,
  type = 'button',
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'relative h-13 w-full overflow-hidden rounded-full border px-6',
        'text-sm font-semibold tracking-[0.14em] uppercase text-white',

        /* vivid rose-to-deep gradient */
        'border-[rgba(194,37,74,0.38)] bg-[linear-gradient(135deg,#f25a7a_0%,#e8476a_40%,#c2254a_100%)]',

        /* shadow with colored glow */
        'shadow-[0_12px_36px_rgba(194,37,74,0.38),0_4px_12px_rgba(194,37,74,0.22)]',

        /* transitions */
        'transition-all duration-300',
        'hover:brightness-110 hover:shadow-[0_16px_44px_rgba(194,37,74,0.48),0_6px_16px_rgba(194,37,74,0.28)]',
        'hover:-translate-y-px',
        'active:translate-y-px active:brightness-95',
        'disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:translate-y-0',

        className,
      )}
      {...rest}
    />
  )
}
