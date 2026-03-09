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
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return new Intl.DateTimeFormat(DATE_LOCALE_MAP[locale], {
    dateStyle: 'long',
  }).format(parsedDate)
}

export function DateSection({ meaningfulDate, locale, copy }: DateSectionProps) {
  const formattedDate = formatMeaningfulDate(meaningfulDate, locale)

  return (
    <SectionShell id="date" eyebrow={copy.dateEyebrow} title={copy.dateTitle}>
      <div className="rounded-2xl border border-white/60 bg-white/58 p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--ink-soft)]">
          {copy.dateLabel}
        </p>
        <p className="font-display mt-1 text-[2rem] leading-tight text-[var(--ink-main)] sm:text-[2.3rem]">
          {formattedDate}
        </p>
      </div>
      <p className="mt-4 text-[0.96rem] leading-7 text-[var(--ink-soft)]">
        {copy.dateCaption}
      </p>
    </SectionShell>
  )
}
