import { motion } from 'framer-motion'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { GlassCard } from '../../../shared/GlassCard'
import { PrimaryButton } from '../../../shared/PrimaryButton'
import type { LamsaCopy } from '../copy'

interface PasswordGateProps {
  receiverName: string
  expectedPassword: string
  copy: LamsaCopy
  onUnlocked: () => void
}

export function PasswordGate({
  receiverName,
  expectedPassword,
  copy,
  onUnlocked,
}: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isChecking) {
      return
    }

    setError('')
    setIsChecking(true)

    window.setTimeout(() => {
      if (password.trim() === expectedPassword) {
        onUnlocked()
      } else {
        setError(copy.passwordError)
        setIsChecking(false)
      }
    }, 180)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.2, 0.65, 0.3, 1] }}
      className="mx-auto max-w-[30rem] pt-16 pb-10 sm:pt-20"
    >
      <GlassCard className="relative overflow-hidden">
        <span className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-[rgba(205,142,147,0.28)] blur-3xl" />

        <p className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-[var(--rose-main)]">
          {copy.badge}
        </p>
        <h1 className="font-display mb-2 text-[2.15rem] leading-[1.08] text-[var(--ink-main)] sm:text-[2.4rem]">
          {copy.passwordTitle}
        </h1>
        <p className="mb-2 text-sm text-[var(--ink-soft)]">
          {copy.passwordSubtitle}
        </p>
        <p className="mb-6 text-sm font-semibold text-[var(--ink-main)]">
          {receiverName}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="gift-password"
            className="mb-2 block text-xs font-semibold tracking-[0.13em] uppercase text-[var(--ink-soft)]"
          >
            {copy.passwordLabel}
          </label>
          <input
            id="gift-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            className="input-ring mb-3 h-12 w-full rounded-full border border-[rgba(183,127,131,0.35)] bg-white/78 px-4 text-[0.95rem] text-[var(--ink-main)] placeholder:text-[rgba(79,57,54,0.55)]"
            autoComplete="off"
            required
          />

          <p className="mb-4 text-xs text-[var(--ink-soft)]">{copy.passwordHint}</p>

          {error ? (
            <motion.p
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-sm text-[#9f4a4e]"
            >
              {error}
            </motion.p>
          ) : null}

          <PrimaryButton type="submit" disabled={isChecking}>
            {copy.unlockButton}
          </PrimaryButton>
        </form>
      </GlassCard>
    </motion.div>
  )
}
