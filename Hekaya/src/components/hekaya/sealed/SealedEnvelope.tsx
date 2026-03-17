import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { HekayaLocale, SealedEnvelopeConfig } from '../../../types/hekaya'
import VoicePlayer from '../../shared/VoicePlayer'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'
import Countdown from './Countdown'

interface SealedEnvelopeProps {
  config: SealedEnvelopeConfig
  locale: HekayaLocale
  onClose: () => void
}

type EnvelopeStage = 'locked' | 'ready' | 'opening' | 'opened'

const SEALED_STORAGE_KEY = 'hekaya_sealed_envelope_progress'

interface StoredSealedEnvelopeProgress {
  firstViewedAt?: string
  openedAt?: string
}

function parseStoredDate(value?: string) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function resolveEnvelopeTargetDate(
  config: SealedEnvelopeConfig,
  firstViewedAt: Date,
): Date | null {
  // Prefer fixed unlockDate when both unlock strategies are configured.
  if (config.unlockDate) {
    const unlockDate = new Date(config.unlockDate)
    return Number.isNaN(unlockDate.getTime()) ? null : unlockDate
  }

  if (typeof config.unlockAfterDays === 'number') {
    return new Date(firstViewedAt.getTime() + config.unlockAfterDays * 86400000)
  }

  return null
}

function isEnvelopeUnlocked(targetDate: Date | null, now = new Date()) {
  if (!targetDate) return true
  return now.getTime() >= targetDate.getTime()
}

function formatDate(date: Date, locale: HekayaLocale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatDays(days: number, locale: HekayaLocale) {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(days)
  }
  return String(days)
}

function EnvelopeVisual({ stage }: { stage: EnvelopeStage }) {
  const isOpening = stage === 'opening'

  return (
    <div className="relative mx-auto h-44 w-72 max-w-full [perspective:1100px]">
      <motion.div
        initial={false}
        animate={{ scale: isOpening ? [1, 1.03, 1] : 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 h-28 rounded-b-3xl border border-[rgba(217,70,239,0.3)] bg-[linear-gradient(160deg,rgba(52,27,77,0.95),rgba(25,13,45,0.95))] shadow-[0_24px_45px_rgba(10,1,24,0.5)]"
      />

      <motion.div
        initial={false}
        animate={isOpening ? { rotateX: -150, y: -8 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 8%' }}
        className="absolute inset-x-0 top-0 h-24 rounded-t-3xl border border-[rgba(217,70,239,0.35)] bg-[linear-gradient(160deg,rgba(74,42,103,0.95),rgba(39,21,67,0.95))]"
      />

      <motion.div
        initial={false}
        animate={isOpening ? { scale: [1, 1.2, 0], opacity: [1, 0.8, 0] } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="absolute left-1/2 top-[58%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(251,191,36,0.5)] bg-[rgba(251,191,36,0.18)] text-[var(--hekaya-gold)] shadow-[0_0_30px_rgba(251,191,36,0.35)]"
      >
        ✦
      </motion.div>
    </div>
  )
}

export function SealedEnvelope({ config, locale, onClose }: SealedEnvelopeProps) {
  const [stage, setStage] = useState<EnvelopeStage>('locked')
  const [firstViewedAt, setFirstViewedAt] = useState<Date | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const openingTimeoutRef = useRef<number | null>(null)

  const copy =
    locale === 'ar'
      ? {
          readyTitle: 'حان وقت الرسالة',
          readyHint: 'رسالة محفوظة من المستقبل في انتظارك.',
          opening: 'نفك الختم...',
          open: 'افتحي الرسالة',
          close: 'الرجوع للفهرس',
          fallbackLocked: 'مختوم حتى يحين الوقت المناسب',
          afterDays: 'يُفتح بعد {days} يوم من أول زيارة',
          untilDate: 'مختوم حتى {date}',
          openedHint: 'وعد محفوظ لوقته المناسب',
        }
      : {
          readyTitle: 'The Letter Is Ready',
          readyHint: 'A message from the future is waiting for you.',
          opening: 'Breaking the seal...',
          open: 'Open Envelope',
          close: 'Back to Hub',
          fallbackLocked: 'Sealed until the right time',
          afterDays: 'Opens after {days} days from first visit',
          untilDate: 'Sealed until {date}',
          openedHint: 'A promise saved for the right moment',
        }

  const paragraphs = useMemo(
    () =>
      config.sealedMessage
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean),
    [config.sealedMessage],
  )

  const lockDescription = useMemo(() => {
    if (targetDate && config.unlockDate) {
      return copy.untilDate.replace('{date}', formatDate(targetDate, locale))
    }

    if (typeof config.unlockAfterDays === 'number' && !config.unlockDate) {
      return copy.afterDays.replace(
        '{days}',
        formatDays(config.unlockAfterDays, locale),
      )
    }

    if (targetDate) {
      return copy.untilDate.replace('{date}', formatDate(targetDate, locale))
    }

    return copy.fallbackLocked
  }, [
    config.unlockAfterDays,
    config.unlockDate,
    copy.afterDays,
    copy.fallbackLocked,
    copy.untilDate,
    locale,
    targetDate,
  ])

  useEffect(() => {
    return () => {
      if (openingTimeoutRef.current !== null) {
        window.clearTimeout(openingTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let stored: StoredSealedEnvelopeProgress = {}
    try {
      const raw = window.localStorage.getItem(SEALED_STORAGE_KEY)
      if (raw) stored = JSON.parse(raw) as StoredSealedEnvelopeProgress
    } catch {
      stored = {}
    }

    const existingFirstViewedAt = parseStoredDate(stored.firstViewedAt)
    const nextFirstViewedAt = existingFirstViewedAt ?? new Date()
    const target = resolveEnvelopeTargetDate(config, nextFirstViewedAt)
    const unlockedNow = isEnvelopeUnlocked(target)
    const openedAt = parseStoredDate(stored.openedAt)

    setFirstViewedAt(nextFirstViewedAt)
    setTargetDate(target)
    setUnlocked(unlockedNow)
    setStage(openedAt ? 'opened' : unlockedNow ? 'ready' : 'locked')

    const payload: StoredSealedEnvelopeProgress = {
      firstViewedAt: nextFirstViewedAt.toISOString(),
      openedAt: openedAt?.toISOString(),
    }
    window.localStorage.setItem(SEALED_STORAGE_KEY, JSON.stringify(payload))

    setIsInitialized(true)
  }, [config])

  const handleCountdownComplete = () => {
    setUnlocked(true)
    setStage((current) => (current === 'locked' ? 'ready' : current))
  }

  const handleOpenEnvelope = () => {
    if (!unlocked || stage === 'opening' || stage === 'opened') return

    setStage('opening')
    openingTimeoutRef.current = window.setTimeout(() => {
      setStage('opened')

      if (typeof window !== 'undefined') {
        const payload: StoredSealedEnvelopeProgress = {
          firstViewedAt: firstViewedAt?.toISOString(),
          openedAt: new Date().toISOString(),
        }
        window.localStorage.setItem(SEALED_STORAGE_KEY, JSON.stringify(payload))
      }
    }, 900)
  }

  if (!isInitialized) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8"
      style={{
        background:
          'radial-gradient(circle at 20% 0%, rgba(217,70,239,0.16), transparent 45%), radial-gradient(circle at 90% 10%, rgba(251,191,36,0.12), transparent 42%), linear-gradient(180deg, #16042b 0%, #0a0118 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl"
      >
        <GlassCard tone="elevated" className="space-y-6 py-10 text-center sm:py-12">
          <div className="space-y-2">
            <h2 className="hekaya-font-display text-2xl text-[var(--hekaya-text-primary)] sm:text-3xl">
              {stage === 'ready' ? copy.readyTitle : config.previewText}
            </h2>
            {stage === 'ready' ? (
              <p className="text-sm text-[var(--hekaya-text-secondary)]">{copy.readyHint}</p>
            ) : stage === 'opening' ? (
              <p className="text-sm text-[var(--hekaya-text-secondary)]">{copy.opening}</p>
            ) : stage === 'opened' ? (
              <p className="text-sm text-[var(--hekaya-text-secondary)]">{copy.openedHint}</p>
            ) : (
              <p className="text-sm text-[var(--hekaya-text-secondary)]">{lockDescription}</p>
            )}
          </div>

          {stage === 'opened' ? null : <EnvelopeVisual stage={stage} />}

          {stage === 'locked' && targetDate ? (
            <Countdown
              targetDate={targetDate}
              locale={locale}
              onComplete={handleCountdownComplete}
            />
          ) : null}

          {stage === 'ready' ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <NeonButton variant="gold" wide={false} onClick={handleOpenEnvelope}>
                {copy.open}
              </NeonButton>
              <NeonButton wide={false} onClick={onClose}>
                {copy.close}
              </NeonButton>
            </div>
          ) : null}

          {stage === 'locked' ? (
            <NeonButton wide={false} onClick={onClose}>
              {copy.close}
            </NeonButton>
          ) : null}

          {stage === 'opened' ? (
            <>
              <div className="space-y-4 text-center">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={`${paragraph}-${index}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.45 + index * 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="hekaya-font-accent text-lg leading-9 text-[var(--hekaya-text-primary)] sm:text-xl sm:leading-10"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {config.voiceNote ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.85 + paragraphs.length * 0.22 }}
                  className="mx-auto w-full max-w-md"
                >
                  <VoicePlayer
                    src={config.voiceNote.src}
                    label={config.voiceNote.label}
                    duration={config.voiceNote.duration}
                    locale={locale}
                  />
                </motion.div>
              ) : null}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 + paragraphs.length * 0.22 }}
              >
                <NeonButton variant="gold" wide={false} onClick={onClose}>
                  {copy.close}
                </NeonButton>
              </motion.div>
            </>
          ) : null}
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

export default SealedEnvelope
