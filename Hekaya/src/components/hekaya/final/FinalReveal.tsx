import { motion } from 'framer-motion'
import type { FinalRevealConfig, HekayaLocale } from '../../../types/hekaya'
import VoicePlayer from '../../shared/VoicePlayer'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'

interface FinalRevealProps {
  config: FinalRevealConfig
  locale: HekayaLocale
  onComplete: () => void
}

interface MessageCardProps {
  lines: string[]
  closingNote?: string
  voiceNote?: FinalRevealConfig['voiceNote']
  locale: HekayaLocale
  onClose: () => void
  closeText: string
}

const HEART_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 10 + (i * 5) % 80,
  y: 20 + (i * 7) % 70,
  delay: i * 0.3,
  duration: 4 + (i % 3) * 1.5,
}))

export function FinalReveal({ config, locale, onComplete }: FinalRevealProps) {
  const lines = config.splitLines ?? config.message.split('\n')
  const copy =
    locale === 'ar'
      ? { close: 'ارجعي للرحلة' }
      : { close: 'Back to Journey' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8"
      style={{
        background: config.backgroundPhoto
          ? `linear-gradient(rgba(10, 1, 24, 0.85), rgba(10, 1, 24, 0.92)), url(${config.backgroundPhoto}) center/cover`
          : 'linear-gradient(180deg, #1a0a2e 0%, #0a0118 100%)',
      }}
    >
      <FloatingHearts />

      <MessageCard
        lines={lines}
        closingNote={config.closingNote}
        voiceNote={config.voiceNote}
        locale={locale}
        onClose={onComplete}
        closeText={copy.close}
      />
    </motion.div>
  )
}

function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEART_PARTICLES.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute text-2xl text-[var(--hekaya-neon-soft)] opacity-40"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

function MessageCard({
  lines,
  closingNote,
  voiceNote,
  locale,
  onClose,
  closeText,
}: MessageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-3xl"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <GlassCard tone="elevated" className="space-y-6 py-10 text-center sm:py-14">
        <div className="space-y-4">
          {lines.map((line, index) => (
            <motion.p
              key={`${line}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6 + index * 0.4,
              }}
              className="hekaya-font-accent text-xl leading-10 text-[var(--hekaya-text-primary)] sm:text-2xl sm:leading-[3rem]"
            >
              {line}
            </motion.p>
          ))}
        </div>

        {closingNote ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.6 + lines.length * 0.4 + 0.5,
            }}
            className="hekaya-font-display text-lg text-[var(--hekaya-gold)] sm:text-xl"
          >
            {closingNote}
          </motion.p>
        ) : null}

        {voiceNote ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.6 + lines.length * 0.4 + 1,
            }}
            className="mx-auto w-full max-w-md"
          >
            <VoicePlayer
              src={voiceNote.src}
              label={voiceNote.label}
              duration={voiceNote.duration}
              locale={locale}
            />
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.6 + lines.length * 0.4 + 1.5,
          }}
        >
          <NeonButton variant="gold" wide={false} onClick={onClose}>
            {closeText}
          </NeonButton>
        </motion.div>
      </GlassCard>
    </motion.div>
  )
}

export default FinalReveal
