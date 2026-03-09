import { SectionShell } from '../../../shared/SectionShell'
import type { GiftLocale } from '../../../types/gift'
import type { LamsaCopy } from '../copy'

interface DateSectionProps {
  meaningfulDate: string
  locale: GiftLocale
  copy: LamsaCopy
}

const DATE_LOCALE_MAP: Record<GiftLocale, string> = {
  en: 'en-US',
  ar: 'ar-EG',
}

function formatMeaningfulDate(dateValue: string, locale: GiftLocale) {
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) return dateValue

  return new Intl.DateTimeFormat(DATE_LOCALE_MAP[locale], {
    dateStyle: 'long',
  }).format(parsedDate)
}

export function DateSection({ meaningfulDate, locale, copy }: DateSectionProps) {
  const formattedDate = formatMeaningfulDate(meaningfulDate, locale)

  return (
    <SectionShell id="date" eyebrow={copy.dateEyebrow} title={copy.dateTitle}>

      {/* Date display card — rose-to-gold gradient */}
      <div
        className="relative overflow-hidden rounded-2xl p-4 sm:p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.78), rgba(253,228,184,0.52))',
          border: '1px solid rgba(249, 164, 60, 0.28)',
        }}
      >
        {/* Subtle background glow */}
        <span
          className="pointer-events-none absolute -top-4 -right-4 h-20 w-20 rounded-full blur-2xl"
          style={{ background: 'rgba(249, 164, 60, 0.22)' }}
        />

        <p
          className="text-xs font-semibold tracking-[0.14em] uppercase"
          style={{ color: 'var(--gold-accent)' }}
        >
          {copy.dateLabel}
        </p>
        <p
          className="font-display mt-1 text-[1.9rem] leading-tight sm:text-[2.3rem]"
          style={{ color: 'var(--ink-main)' }}
        >
          {formattedDate}
        </p>
      </div>

      <p className="mt-4 text-[0.96rem] leading-7" style={{ color: 'var(--ink-soft)' }}>
        {copy.dateCaption}
      </p>
    </SectionShell>
  )
}
