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
  {
    badge: string
    subtitle: string
    toLabel: string
    fromLabel: string
  }
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58, ease: [0.2, 0.65, 0.3, 1] }}
    >
      <GlassCard className="relative overflow-hidden">
        <span className="absolute -top-6 -right-5 h-20 w-20 rounded-full bg-[rgba(205,142,147,0.24)] blur-2xl" />
        <p className="mb-1 text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-[var(--rose-main)]">
          {copy.badge}
        </p>
        <p className="mb-4 text-sm text-[var(--ink-soft)]">{copy.subtitle}</p>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/60 bg-white/56 p-3 sm:p-4">
          <div className="rounded-xl bg-white/55 px-3 py-3 text-center">
            <p className="mb-1 text-[0.66rem] font-semibold tracking-[0.14em] uppercase text-[var(--ink-soft)]">
              {copy.toLabel}
            </p>
            <p className={`${nameClass} text-[var(--ink-main)]`}>{receiverName}</p>
          </div>
          <div className="rounded-xl bg-white/55 px-3 py-3 text-center">
            <p className="mb-1 text-[0.66rem] font-semibold tracking-[0.14em] uppercase text-[var(--ink-soft)]">
              {copy.fromLabel}
            </p>
            <p className={`${nameClass} text-[var(--ink-main)]`}>{senderName}</p>
          </div>
        </div>
      </GlassCard>
    </motion.header>
  )
}
