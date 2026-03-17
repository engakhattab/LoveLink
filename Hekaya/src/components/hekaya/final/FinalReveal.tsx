import { motion } from 'framer-motion'
import { useEffect, useId, useMemo, useState } from 'react'
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
  titleId: string
}

const HEART_PARTICLE_BASE = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 10 + (i * 5) % 80,
  y: 20 + (i * 7) % 70,
  delay: i * 0.3,
  duration: 4 + (i % 3) * 1.5,
}))

export function FinalReveal({ config, locale, onComplete }: FinalRevealProps) {
  const [heartCount, setHeartCount] = useState(18)
  const [reducedMotion, setReducedMotion] = useState(false)
  const titleId = useId()
  const lines = config.splitLines ?? config.message.split('\n')
  const particles = useMemo(
    () => HEART_PARTICLE_BASE.slice(0, heartCount),
    [heartCount],
  )

  const copy =
    locale === 'ar'
      ? { close: 'ارجعي للرحلة' }
      : { close: 'Back to Journey' }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onComplete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onComplete])

  useEffect(() => {
    const recalc = () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      const isNarrow = window.innerWidth < 640
      setReducedMotion(prefersReduced)

      if (prefersReduced) {
        setHeartCount(6)
        return
      }

      setHeartCount(isNarrow ? 10 : 18)
    }

    recalc()
    window.addEventListener('resize', recalc)
    return () => {
      window.removeEventListener('resize', recalc)
    }
  }, [])

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
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <FloatingHearts particles={particles} reducedMotion={reducedMotion} />

      <MessageCard
        lines={lines}
        closingNote={config.closingNote}
        voiceNote={config.voiceNote}
        locale={locale}
        onClose={onComplete}
        closeText={copy.close}
        titleId={titleId}
      />
    </motion.div>
  )
}

function FloatingHearts({
  particles,
  reducedMotion,
}: {
  particles: typeof HEART_PARTICLE_BASE
  reducedMotion: boolean
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute text-2xl text-[var(--hekaya-neon-soft)] opacity-40"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={
            reducedMotion
              ? {
                  opacity: [0.2, 0.35, 0.2],
                  scale: [0.95, 1, 0.95],
                }
              : {
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.8, 1.1, 0.8],
                }
          }
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
  titleId,
}: MessageCardProps) {
  const [voiceFailed, setVoiceFailed] = useState(false)
  const copy =
    locale === 'ar'
      ? { voiceFailed: 'تعذر تشغيل الرسالة الصوتية حالياً.' }
      : { voiceFailed: 'Unable to play the voice note right now.' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-3xl"
    >
      <GlassCard tone="elevated" className="space-y-6 py-10 text-center sm:py-14">
        <h2 id={titleId} className="sr-only">
          {locale === 'ar' ? 'الرسالة الأخيرة' : 'Final Message'}
        </h2>

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
              onError={() => setVoiceFailed(true)}
            />
            {voiceFailed ? (
              <p className="mt-2 text-xs text-[var(--hekaya-text-muted)]">
                {copy.voiceFailed}
              </p>
            ) : null}
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
