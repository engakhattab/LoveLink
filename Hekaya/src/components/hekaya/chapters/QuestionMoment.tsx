import { motion } from 'framer-motion'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'
import type { HekayaLocale } from '../../../types/hekaya'

interface QuestionMomentProps {
  question: string
  onAcknowledge: () => void
  acknowledged: boolean
  locale: HekayaLocale
}

export function QuestionMoment({
  question,
  onAcknowledge,
  acknowledged,
  locale,
}: QuestionMomentProps) {
  const copy =
    locale === 'ar'
      ? {
          title: 'لحظة تأمل 💭',
          placeholder: 'خدي نفس هادي... وتأملي السؤال على راحتك.',
          cta: acknowledged ? 'تأملت ✓' : 'تأملت',
        }
      : {
          title: 'Reflective Moment 💭',
          placeholder: 'Pause for a calm breath and reflect on this question.',
          cta: acknowledged ? 'Reflected ✓' : 'I Reflected',
        }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard
        tone="elevated"
        className="relative overflow-hidden border-[rgba(217,70,239,0.42)]"
      >
        <motion.div
          animate={{ opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-12 left-1/2 h-28 w-48 -translate-x-1/2 rounded-[100%] bg-[rgba(217,70,239,0.22)] blur-2xl"
        />

        <div className="relative z-10 space-y-4">
          <p className="hekaya-font-display text-lg text-[var(--hekaya-text-primary)] sm:text-xl">
            {copy.title}
          </p>

          <div className="rounded-2xl border border-[rgba(251,191,36,0.35)] bg-[rgba(24,12,42,0.6)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="mb-3 h-3 w-full rounded-full bg-[linear-gradient(90deg,rgba(251,191,36,0.35),rgba(217,70,239,0.45))]" />
            <p className="text-sm leading-8 text-[var(--hekaya-text-primary)]">{question}</p>
          </div>

          <p className="text-sm text-[var(--hekaya-text-secondary)]">{copy.placeholder}</p>

          <NeonButton wide={false} onClick={onAcknowledge} disabled={acknowledged}>
            {copy.cta}
          </NeonButton>
        </div>
      </GlassCard>
    </motion.div>
  )
}
