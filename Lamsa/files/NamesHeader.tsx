import { motion } from 'framer-motion'
import { GlassCard } from '../../../shared/GlassCard'
import type { GiftLocale } from '../../../types/gift'

interface NamesHeaderProps {
  receiverName: string
  senderName: string
  locale: GiftLocale
}

const HEADER_COPY: Record<
  GiftLocale,
  { badge: string; subtitle: string; toLabel: string; fromLabel: string }
> = {
  en: {
    badge: 'A Personal Dedication',
    subtitle: 'From one heart to another',
    toLabel: 'To',
    fromLabel: 'From',
  },
  ar: {
    badge: 'إهداء خاص',
    subtitle: 'من قلبي إلى قلبك',
    toLabel: 'إلى',
    fromLabel: 'من',
  },
}

export function NamesHeader({ receiverName, senderName, locale }: NamesHeaderProps) {
  const copy = HEADER_COPY[locale]
  const nameClass =
    locale === 'ar'
      ? 'font-ar-calligraphy text-[2.15rem] leading-[1.2] sm:text-[2.5rem]'
      : 'font-display text-[2rem] leading-tight sm:text-[2.3rem]'

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1] }}
    >
      <GlassCard accent className="relative overflow-hidden">

        {/* Decorative corner blobs */}
        <span
          className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl"
          style={{ background: 'rgba(232, 71, 106, 0.22)' }}
        />
        <span
          className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full blur-3xl"
          style={{ background: 'rgba(249, 164, 60, 0.18)' }}
        />

        {/* Badge */}
        <div
          className="mb-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5"
          style={{
            borderColor: 'rgba(232, 71, 106, 0.28)',
            background: 'rgba(232, 71, 106, 0.07)',
          }}
        >
          <span
            className="text-[0.66rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: 'var(--rose-main)' }}
          >
            {copy.badge}
          </span>
        </div>

        <p className="mb-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
          {copy.subtitle}
        </p>

        {/* Names grid */}
        <div
          className="grid grid-cols-2 gap-3 rounded-2xl p-3 sm:p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.68)',
          }}
        >
          {/* Receiver - rose tinted */}
          <div
            className="rounded-xl px-3 py-3 text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(255,214,227,0.55))',
              border: '1px solid rgba(232, 71, 106, 0.18)',
            }}
          >
            <p
              className="mb-1 text-[0.66rem] font-semibold tracking-[0.14em] uppercase"
              style={{ color: 'var(--rose-main)' }}
            >
              {copy.toLabel}
            </p>
            <p className={`${nameClass}`} style={{ color: 'var(--ink-main)' }}>
              {receiverName}
            </p>
          </div>

          {/* Sender - gold tinted */}
          <div
            className="rounded-xl px-3 py-3 text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(253,228,184,0.48))',
              border: '1px solid rgba(249, 164, 60, 0.2)',
            }}
          >
            <p
              className="mb-1 text-[0.66rem] font-semibold tracking-[0.14em] uppercase"
              style={{ color: 'var(--gold-accent)' }}
            >
              {copy.fromLabel}
            </p>
            <p className={`${nameClass}`} style={{ color: 'var(--ink-main)' }}>
              {senderName}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.header>
  )
}
