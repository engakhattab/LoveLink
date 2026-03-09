import { motion } from 'framer-motion'
import { SectionShell } from '../../../shared/SectionShell'
import type { LamsaCopy } from '../copy'

interface WelcomeSectionProps {
  receiverName: string
  senderName: string
  copy: LamsaCopy
}

export function WelcomeSection({
  receiverName,
  senderName,
  copy,
}: WelcomeSectionProps) {
  return (
    <SectionShell
      id="intro"
      eyebrow={copy.welcomeEyebrow}
      title={copy.welcomeTitle}
      className="relative overflow-hidden"
    >
      {/* Decorative glow */}
      <span
        className="pointer-events-none absolute right-4 bottom-4 h-28 w-28 rounded-full blur-3xl"
        style={{ background: 'rgba(249, 164, 60, 0.18)' }}
      />

      <p className="mb-5 text-[1rem] leading-7" style={{ color: 'var(--ink-soft)' }}>
        {copy.welcomeText}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.12, duration: 0.45 }}
        className="rounded-2xl px-4 py-3.5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,214,227,0.48))',
          border: '1px solid rgba(232, 71, 106, 0.2)',
        }}
      >
        <p
          className="font-display text-2xl"
          style={{ color: 'var(--ink-main)' }}
        >
          {receiverName}
        </p>
        <p className="mt-1 text-sm" style={{ color: 'var(--rose-main)' }}>
          {copy.signaturePrefix} {senderName}
        </p>
      </motion.div>
    </SectionShell>
  )
}
