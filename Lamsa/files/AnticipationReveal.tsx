import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { GlassCard } from '../../../shared/GlassCard'
import type { LamsaCopy } from '../copy'

interface AnticipationRevealProps {
  copy: LamsaCopy
  onComplete: () => void
}

const REVEAL_DURATION_MS = 2800

export function AnticipationReveal({
  copy,
  onComplete,
}: AnticipationRevealProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, REVEAL_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42 }}
      className="mx-auto flex min-h-[62vh] max-w-[30rem] items-center justify-center pt-10"
    >
      <GlassCard accent className="w-full text-center">

        {/* Heartbeat pulse ring stack */}
        <div className="mx-auto mb-7 relative flex h-14 w-14 items-center justify-center">
          {/* outer ring pulse */}
          <motion.span
            className="absolute rounded-full"
            style={{
              width: 56,
              height: 56,
              background: 'rgba(232, 71, 106, 0.12)',
              border: '1.5px solid rgba(232, 71, 106, 0.28)',
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* mid ring */}
          <motion.span
            className="absolute rounded-full"
            style={{
              width: 38,
              height: 38,
              background: 'rgba(232, 71, 106, 0.18)',
              border: '1.5px solid rgba(232, 71, 106, 0.4)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.1 }}
          />
          {/* core dot */}
          <motion.span
            className="relative block rounded-full"
            style={{
              width: 18,
              height: 18,
              background: 'linear-gradient(135deg, #f25a7a, #c2254a)',
              boxShadow: '0 0 16px rgba(232, 71, 106, 0.55)',
            }}
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <h2
          className="font-display mb-2.5 text-4xl leading-tight"
          style={{ color: 'var(--ink-main)' }}
        >
          {copy.revealTitle}
        </h2>
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          {copy.revealSubtitle}
        </p>

        {/* progress bar */}
        <div
          className="mx-auto mt-6 h-0.5 overflow-hidden rounded-full"
          style={{
            width: '56px',
            background: 'rgba(232, 71, 106, 0.15)',
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #f25a7a, #f9a43c)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: REVEAL_DURATION_MS / 1000, ease: 'linear' }}
          />
        </div>
      </GlassCard>
    </motion.div>
  )
}
