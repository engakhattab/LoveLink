import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { HekayaLocale } from '../../../types/hekaya'

interface CountdownProps {
  targetDate: Date
  locale: HekayaLocale
  onComplete?: () => void
}

interface CountdownParts {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

const ARABIC_DIGIT_FORMATTER = new Intl.NumberFormat('ar-EG', {
  useGrouping: false,
})

function getCountdownParts(targetDate: Date, now = new Date()): CountdownParts {
  const diff = Math.max(0, targetDate.getTime() - now.getTime())

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isComplete: diff === 0,
  }
}

function formatDigits(value: number, locale: HekayaLocale, minDigits = 2) {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-EG', {
      minimumIntegerDigits: minDigits,
      useGrouping: false,
    }).format(value)
  }

  return value.toString().padStart(minDigits, '0')
}

export function Countdown({ targetDate, locale, onComplete }: CountdownProps) {
  const [parts, setParts] = useState<CountdownParts>(() =>
    getCountdownParts(targetDate),
  )
  const [pulse, setPulse] = useState(false)
  const completeRef = useRef(false)

  const copy =
    locale === 'ar'
      ? {
          days: 'يوم',
          hours: 'ساعة',
          minutes: 'دقيقة',
          seconds: 'ثانية',
          complete: 'تم فك الختم',
        }
      : {
          days: 'Days',
          hours: 'Hours',
          minutes: 'Minutes',
          seconds: 'Seconds',
          complete: 'Seal unlocked',
        }

  useEffect(() => {
    completeRef.current = false
    setPulse(false)
    setParts(getCountdownParts(targetDate))

    const tick = () => {
      const next = getCountdownParts(targetDate)
      setParts(next)

      if (next.isComplete && !completeRef.current) {
        completeRef.current = true
        setPulse(true)
        onComplete?.()
      }
    }

    tick()
    if (getCountdownParts(targetDate).isComplete) return

    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [onComplete, targetDate])

  const cells = [
    { label: copy.days, value: formatDigits(parts.days, locale) },
    { label: copy.hours, value: formatDigits(parts.hours, locale) },
    { label: copy.minutes, value: formatDigits(parts.minutes, locale) },
    { label: copy.seconds, value: formatDigits(parts.seconds, locale) },
  ]

  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="space-y-2"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="rounded-xl border border-[rgba(217,70,239,0.28)] bg-[rgba(22,10,38,0.72)] px-3 py-2 text-center"
          >
            <p className="hekaya-font-display text-xl text-[var(--hekaya-text-primary)]">
              {locale === 'ar'
                ? cell.value.replace(/\d/g, (digit) =>
                    ARABIC_DIGIT_FORMATTER.format(Number(digit)),
                  )
                : cell.value}
            </p>
            <p className="mt-1 text-xs text-[var(--hekaya-text-muted)]">{cell.label}</p>
          </div>
        ))}
      </div>
      {parts.isComplete ? (
        <p className="text-sm text-[var(--hekaya-gold)]">{copy.complete}</p>
      ) : null}
    </motion.div>
  )
}

export default Countdown
