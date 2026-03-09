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
      <span className="absolute right-5 bottom-4 h-24 w-24 rounded-full bg-[rgba(189,130,133,0.14)] blur-2xl" />
      <p className="mb-5 text-[1rem] leading-7 text-[var(--ink-soft)]">
        {copy.welcomeText}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="rounded-2xl border border-white/55 bg-white/55 px-4 py-3"
      >
        <p className="font-display text-2xl text-[var(--ink-main)]">{receiverName}</p>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {copy.signaturePrefix} {senderName}
        </p>
      </motion.div>
    </SectionShell>
  )
}
