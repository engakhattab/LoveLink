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
      transition={{ duration: 0.4 }}
      className="mx-auto flex min-h-[62vh] max-w-[30rem] items-center justify-center pt-10"
    >
      <GlassCard className="w-full text-center">
        <motion.span
          className="mx-auto mb-6 block h-2 w-2 rounded-full bg-[var(--rose-main)]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <h2 className="font-display mb-2 text-4xl leading-tight text-[var(--ink-main)]">
          {copy.revealTitle}
        </h2>
        <p className="text-sm text-[var(--ink-soft)]">{copy.revealSubtitle}</p>
      </GlassCard>
    </motion.div>
  )
}
