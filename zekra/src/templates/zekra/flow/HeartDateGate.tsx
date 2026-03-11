import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { GlowButton } from '../../../shared/GlowButton'
import type { UnlockDate, ZekraLocale } from '../../../types/zekra'
import type { ZekraCopy } from '../copy'

interface HeartDateGateProps {
  receiverName: string
  senderName: string
  expectedDate: UnlockDate
  locale: ZekraLocale
  copy: ZekraCopy
  onUnlocked: () => void
}

interface DateDialProps {
  label: string
  value: number
  pad: number
  onIncrease: () => void
  onDecrease: () => void
}

const NAME_DECOR = [
  { glyph: '\u2665', delay: 0 },
  { glyph: '\u2726', delay: 0.12 },
  { glyph: '\u2666', delay: 0.24 },
  { glyph: '\u2726', delay: 0.36 },
  { glyph: '\u2665', delay: 0.48 },
] as const

const HEART_DOTS = [
  { top: '19%', left: '18%', glyph: '\u2726', size: 10, delay: 0.1 },
  { top: '16%', left: '58%', glyph: '\u2665', size: 12, delay: 0.45 },
  { top: '30%', left: '76%', glyph: '\u2726', size: 9, delay: 0.8 },
  { top: '48%', left: '16%', glyph: '\u2665', size: 11, delay: 0.25 },
  { top: '54%', left: '60%', glyph: '\u2726', size: 9, delay: 1.05 },
  { top: '68%', left: '35%', glyph: '\u2665', size: 10, delay: 0.6 },
  { top: '39%', left: '40%', glyph: '\u2726', size: 8, delay: 1.2 },
  { top: '72%', left: '66%', glyph: '\u2665', size: 10, delay: 0.9 },
] as const

function cycleValue(values: number[], current: number, delta: 1 | -1) {
  const currentIndex = values.indexOf(current)
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + delta + values.length) % values.length
  return values[nextIndex]
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function DateDial({ label, value, pad, onIncrease, onDecrease }: DateDialProps) {
  return (
    <div className="relative flex h-[7.8rem] w-[4.5rem] flex-col items-center justify-between rounded-[2.2rem] border border-[rgba(255,255,255,0.48)] bg-[rgba(255,255,255,0.16)] py-2 shadow-[0_8px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.54)] backdrop-blur-[16px]">
      <span className="sr-only">{label}</span>
      <button
        className="flex h-7 w-8 items-center justify-center rounded-full text-lg text-white/90 transition hover:scale-[1.05]"
        onClick={onIncrease}
        type="button"
        aria-label={`Increase ${label}`}
      >
        ▲
      </button>
      <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.96)] text-[1.06rem] font-black text-[var(--rose-deep)] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        {value.toString().padStart(pad, '0')}
      </div>
      <button
        className="flex h-7 w-8 items-center justify-center rounded-full text-lg text-white/90 transition hover:scale-[1.05]"
        onClick={onDecrease}
        type="button"
        aria-label={`Decrease ${label}`}
      >
        ▼
      </button>
    </div>
  )
}

export function HeartDateGate({
  receiverName,
  senderName,
  expectedDate,
  locale,
  copy,
  onUnlocked,
}: HeartDateGateProps) {
  const years = useMemo(() => {
    return Array.from({ length: 17 }, (_, index) => 2018 + index)
  }, [])

  const startMonth = expectedDate.month === 1 ? 2 : expectedDate.month - 1
  const [year, setYear] = useState(expectedDate.year)
  const [month, setMonth] = useState(startMonth)
  const [day, setDay] = useState(() =>
    Math.min(expectedDate.day, getDaysInMonth(expectedDate.year, startMonth)),
  )
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const dayValues = useMemo(() => {
    const totalDays = getDaysInMonth(year, month)
    return Array.from({ length: totalDays }, (_, index) => index + 1)
  }, [year, month])

  useEffect(() => {
    const maxDay = getDaysInMonth(year, month)
    if (day > maxDay) {
      setDay(maxDay)
    }
  }, [day, month, year])

  const isArabic = locale === 'ar'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isChecking) {
      return
    }

    setIsChecking(true)
    setError('')

    window.setTimeout(() => {
      const isMatch =
        day === expectedDate.day &&
        month === expectedDate.month &&
        year === expectedDate.year

      if (isMatch) {
        onUnlocked()
        return
      }

      setError(copy.wrongDateText)
      setShakeKey((value) => value + 1)
      setIsChecking(false)
    }, 450)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1] }}
      className="mx-auto max-w-[30rem] px-1 pt-10 sm:pt-14"
    >
      <div className="relative overflow-visible px-2 sm:px-4">
        <span className="absolute -top-16 -right-14 h-40 w-40 rounded-full bg-[rgba(255,126,196,0.22)] blur-3xl" />
        <span className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[rgba(255,188,96,0.12)] blur-3xl" />

        <p className="mb-1 text-center text-xs font-semibold tracking-[0.16em] uppercase text-[var(--gold-accent)]">
          {copy.lockKicker}
        </p>
        <h1 className="font-script mb-1.5 text-center text-[2.55rem] leading-[0.95] text-[var(--ink-main)] sm:text-5xl">
          {copy.lockTitle}
        </h1>
        <p
          className={`mx-auto mb-1 max-w-[23rem] text-center text-sm text-[var(--ink-soft)] ${
            isArabic ? 'font-ar-body text-[1.03rem] leading-8' : ''
          }`}
        >
          {copy.lockSubtitle}
        </p>
        <p
          className={`mb-2 text-center ${
            isArabic
              ? 'font-ar-thuluth text-[2.2rem] leading-[1.1] text-[var(--ink-main)]'
              : 'text-sm text-[var(--ink-muted)]'
          }`}
        >
          {receiverName} <span className="mx-1 text-[var(--rose-main)]">❤</span> {senderName}
        </p>

        <div className="mb-4 flex items-center justify-center gap-2">
          {NAME_DECOR.map((item, index) => (
            <motion.span
              key={`${item.glyph}-${index}`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5], y: [0, -2, 0] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: item.delay,
              }}
              className="text-[var(--rose-main)] drop-shadow-[0_0_10px_rgba(255,78,159,0.5)]"
            >
              {item.glyph}
            </motion.span>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <motion.div
            key={shakeKey}
            animate={error ? { x: [0, -9, 8, -5, 0] } : undefined}
            transition={{ duration: 0.35 }}
            className="relative mx-auto mt-1 h-[20.2rem] w-[18.75rem] sm:h-[21.4rem] sm:w-[19.5rem]"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1], y: [0, -2, 0] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 bottom-0 h-[17.1rem] w-full overflow-hidden"
              style={{
                clipPath:
                  "path('M150 270 L132 252 C57 193 0 152 0 85 C0 40 35 0 84 0 C110 0 136 13 150 36 C164 13 190 0 216 0 C265 0 300 40 300 85 C300 152 243 193 168 252 Z')",
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(191,74,137,0.76)_0%,rgba(147,31,95,0.87)_46%,rgba(88,17,56,0.94)_100%)] shadow-[0_24px_52px_rgba(95,18,63,0.52),inset_0_3px_24px_rgba(255,255,255,0.24),inset_0_-8px_18px_rgba(61,8,37,0.32)]" />
              <span className="absolute left-[14%] top-[6%] h-14 w-24 rounded-full bg-[rgba(255,255,255,0.26)] blur-xl" />
              <span className="absolute left-[23%] top-[8%] h-6 w-11 rounded-full bg-[rgba(255,255,255,0.33)] blur-[5px]" />

              {HEART_DOTS.map((dot, index) => (
                <motion.span
                  key={`${dot.top}-${dot.left}-${index}`}
                  className="absolute text-white/60"
                  style={{
                    top: dot.top,
                    left: dot.left,
                    fontSize: dot.size,
                  }}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                  transition={{
                    duration: 1.7 + index * 0.2,
                    delay: dot.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {dot.glyph}
                </motion.span>
              ))}
            </motion.div>

            <div className="absolute left-1/2 top-[55%] z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="flex gap-2">
                <DateDial
                  label={copy.yearLabel}
                  value={year}
                  pad={4}
                  onIncrease={() => setYear((value) => cycleValue(years, value, 1))}
                  onDecrease={() => setYear((value) => cycleValue(years, value, -1))}
                />
                <DateDial
                  label={copy.monthLabel}
                  value={month}
                  pad={2}
                  onIncrease={() =>
                    setMonth((value) =>
                      cycleValue(
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        value,
                        1,
                      ),
                    )
                  }
                  onDecrease={() =>
                    setMonth((value) =>
                      cycleValue(
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        value,
                        -1,
                      ),
                    )
                  }
                />
                <DateDial
                  label={copy.dayLabel}
                  value={day}
                  pad={2}
                  onIncrease={() => setDay((value) => cycleValue(dayValues, value, 1))}
                  onDecrease={() => setDay((value) => cycleValue(dayValues, value, -1))}
                />
              </div>
            </div>
          </motion.div>

          {error ? (
            <p
              className={`mb-3 text-center text-sm text-[#ffc4dd] ${
                isArabic ? 'font-ar-body text-base' : ''
              }`}
            >
              {error}
            </p>
          ) : (
            <p className="mb-3 text-center text-[0.82rem] text-[var(--ink-muted)]">
              {year.toString().padStart(4, '0')}-
              {month.toString().padStart(2, '0')}-
              {day.toString().padStart(2, '0')}
            </p>
          )}

          <div className="mx-auto max-w-[17rem]">
            <GlowButton type="submit" disabled={isChecking}>
              {copy.unlockButton}
            </GlowButton>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
