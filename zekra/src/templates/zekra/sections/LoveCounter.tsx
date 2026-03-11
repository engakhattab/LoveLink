import { useEffect, useMemo, useState } from 'react'
import { SectionBlock } from '../../../shared/SectionBlock'
import type { UnlockDate, ZekraLocale } from '../../../types/zekra'
import type { ZekraCopy } from '../copy'

interface LoveCounterProps {
  unlockDate: UnlockDate
  locale: ZekraLocale
  copy: ZekraCopy
}

interface CounterValues {
  years: number
  months: number
  hours: number
  minutes: number
  seconds: number
}

function addYears(date: Date, years: number) {
  const next = new Date(date)
  next.setFullYear(next.getFullYear() + years)
  return next
}

function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function getCounterValues(start: Date, end: Date): CounterValues {
  if (end <= start) {
    return { years: 0, months: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  let cursor = new Date(start)
  let years = 0
  let months = 0

  while (addYears(cursor, 1) <= end) {
    cursor = addYears(cursor, 1)
    years += 1
  }

  while (addMonths(cursor, 1) <= end) {
    cursor = addMonths(cursor, 1)
    months += 1
  }

  let remaining = Math.floor((end.getTime() - cursor.getTime()) / 1000)
  const hours = Math.floor(remaining / 3600)
  remaining -= hours * 3600
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining - minutes * 60

  return { years, months, hours, minutes, seconds }
}

export function LoveCounter({ unlockDate, locale, copy }: LoveCounterProps) {
  const [now, setNow] = useState(() => new Date())
  const isArabic = locale === 'ar'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const startDate = useMemo(
    () => new Date(unlockDate.year, unlockDate.month - 1, unlockDate.day, 0, 0, 0),
    [unlockDate.day, unlockDate.month, unlockDate.year],
  )

  const values = getCounterValues(startDate, now)

  const cells = [
    { label: copy.yearsLabel, value: values.years },
    { label: copy.monthsLabel, value: values.months },
    { label: copy.hoursLabel, value: values.hours },
    { label: copy.minutesLabel, value: values.minutes },
    { label: copy.secondsLabel, value: values.seconds },
  ]

  return (
    <SectionBlock
      id="counter"
      eyebrow={copy.counterKicker}
      title={copy.counterTitle}
      accent="gold"
      className="relative"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cells.map((cell, index) => (
          <div
            key={`${cell.label}-${index}`}
            className="rounded-2xl border border-[rgba(255,190,85,0.32)] bg-[rgba(255,255,255,0.06)] px-3 py-3 text-center"
          >
            <p className="mb-1 text-3xl font-bold text-[var(--ink-main)]">
              {cell.value.toString().padStart(2, '0')}
            </p>
            <p
              className={`text-[0.7rem] text-[var(--ink-muted)] ${
                isArabic
                  ? 'font-ar-body text-sm tracking-normal'
                  : 'tracking-[0.12em] uppercase'
              }`}
            >
              {cell.label}
            </p>
          </div>
        ))}
      </div>
    </SectionBlock>
  )
}
