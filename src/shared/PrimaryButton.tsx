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
        'h-12 w-full rounded-full border px-5 text-sm font-semibold tracking-[0.12em] uppercase',
        'border-[rgba(183,127,131,0.52)] bg-[linear-gradient(150deg,#c99497,#af767a)] text-white',
        'transition duration-300 hover:brightness-105 active:translate-y-px disabled:opacity-55 disabled:cursor-not-allowed',
        'shadow-[0_10px_30px_rgba(126,72,72,0.2)]',
        className,
      )}
      {...rest}
    />
  )
}
