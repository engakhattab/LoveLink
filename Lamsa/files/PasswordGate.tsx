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
    if (isChecking) return

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
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.2, 0.65, 0.3, 1] }}
      className="mx-auto max-w-[30rem] pt-16 pb-10 sm:pt-20"
    >
      <GlassCard accent className="relative overflow-hidden">

        {/* Decorative rose glow blobs */}
        <span
          className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full blur-3xl"
          style={{ background: 'rgba(232, 71, 106, 0.28)' }}
        />
        <span
          className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full blur-3xl"
          style={{ background: 'rgba(249, 164, 60, 0.2)' }}
        />

        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1"
          style={{
            borderColor: 'rgba(232, 71, 106, 0.3)',
            background: 'rgba(232, 71, 106, 0.08)',
          }}
        >
          <span
            className="text-[0.68rem] font-bold tracking-[0.18em] uppercase"
            style={{ color: 'var(--rose-main)' }}
          >
            {copy.badge}
          </span>
        </div>

        <h1
          className="font-display mb-3 text-[2.15rem] leading-[1.1] sm:text-[2.5rem]"
          style={{ color: 'var(--ink-main)' }}
        >
          {copy.passwordTitle}
        </h1>

        <p className="mb-2 text-sm leading-6" style={{ color: 'var(--ink-soft)' }}>
          {copy.passwordSubtitle}
        </p>

        <p
          className="font-display mb-6 text-xl"
          style={{ color: 'var(--rose-main)' }}
        >
          {receiverName}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="gift-password"
            className="mb-2 block text-xs font-semibold tracking-[0.14em] uppercase"
            style={{ color: 'var(--ink-soft)' }}
          >
            {copy.passwordLabel}
          </label>

          <input
            id="gift-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            className="input-ring mb-3 h-12 w-full rounded-full border px-5 text-[0.95rem] placeholder:opacity-50"
            style={{
              borderColor: 'rgba(232, 71, 106, 0.3)',
              background: 'rgba(255, 255, 255, 0.82)',
              color: 'var(--ink-main)',
            }}
            autoComplete="off"
            required
          />

          <p className="mb-4 text-xs" style={{ color: 'var(--ink-soft)' }}>
            {copy.passwordHint}
          </p>

          {error ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-sm font-medium"
              style={{ color: 'var(--rose-deep)' }}
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
