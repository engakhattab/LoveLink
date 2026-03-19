import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'
import type { HekayaLocale, UnlockDateConfig } from '../../../types/hekaya'

interface HeartDateGateProps {
  unlockDate: UnlockDateConfig
  ceremonyMessage?: string
  longPressRequired?: boolean
  onUnlock: () => void
  locale: HekayaLocale
}

interface DateDialProps {
  label: string
  value: number
  min: number
  max: number
  width: 'short' | 'long'
  locale: HekayaLocale
  onIncrease: () => void
  onDecrease: () => void
  disabled?: boolean
}

type GateStage = 'ceremony' | 'date_input' | 'unlocking'

const LONG_PRESS_MS = 2000
const MONTH_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

function cycleValue(values: number[], current: number, delta: 1 | -1) {
  const currentIndex = values.indexOf(current)
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + delta + values.length) % values.length
  return values[nextIndex]!
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function formatDigits(value: number, minDigits: number, locale: HekayaLocale) {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-EG', {
      minimumIntegerDigits: minDigits,
      useGrouping: false,
    }).format(value)
  }
  return value.toString().padStart(minDigits, '0')
}

function DateDial({
  label,
  value,
  min,
  max,
  width,
  locale,
  onIncrease,
  onDecrease,
  disabled,
}: DateDialProps) {
  return (
    <div
      role="spinbutton"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={formatDigits(value, width === 'long' ? 4 : 2, locale)}
      className={clsx(
        'flex flex-col items-center gap-2 rounded-[1.8rem] border px-2 py-2',
        'border-[rgba(217,70,239,0.5)] bg-[rgba(35,20,60,0.75)]',
        'shadow-[0_10px_24px_rgba(5,1,20,0.46),inset_0_1px_0_rgba(255,255,255,0.12)]',
        width === 'long' ? 'w-[6.1rem]' : 'w-[4.8rem]',
      )}
    >
      <span className="text-[0.62rem] tracking-[0.16em] text-[var(--hekaya-text-muted)] uppercase">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--hekaya-neon-soft)] transition hover:bg-[rgba(217,70,239,0.2)] disabled:opacity-40"
        aria-label={`Increase ${label}`}
      >
        ▲
      </button>
      <div className="flex h-10 w-full items-center justify-center rounded-xl bg-[rgba(10,3,22,0.92)] text-base font-semibold text-[var(--hekaya-text-primary)]">
        {formatDigits(value, width === 'long' ? 4 : 2, locale)}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--hekaya-neon-soft)] transition hover:bg-[rgba(217,70,239,0.2)] disabled:opacity-40"
        aria-label={`Decrease ${label}`}
      >
        ▼
      </button>
    </div>
  )
}

export function HeartDateGate({
  unlockDate,
  ceremonyMessage,
  longPressRequired = false,
  onUnlock,
  locale,
}: HeartDateGateProps) {
  const years = Array.from({ length: 13 }, (_, index) => unlockDate.year - 6 + index)
  const startMonth = unlockDate.month === 1 ? 2 : unlockDate.month - 1
  const initialStage: GateStage = longPressRequired ? 'ceremony' : 'date_input'

  const [stage, setStage] = useState<GateStage>(initialStage)
  const [year, setYear] = useState(unlockDate.year)
  const [month, setMonth] = useState(startMonth)
  const [day, setDay] = useState(() =>
    Math.min(unlockDate.day, getDaysInMonth(unlockDate.year, startMonth)),
  )
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [pressProgress, setPressProgress] = useState(0)
  const [isPressing, setIsPressing] = useState(false)

  const pressIntervalRef = useRef<number | null>(null)
  const pressTimeoutRef = useRef<number | null>(null)
  const pressStartAtRef = useRef<number>(0)

  const dayValues = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, index) => index + 1,
  )

  useEffect(() => {
    const maxDay = getDaysInMonth(year, month)
    if (day > maxDay) setDay(maxDay)
  }, [day, month, year])

  useEffect(() => {
    return () => {
      if (pressIntervalRef.current !== null) {
        window.clearInterval(pressIntervalRef.current)
      }
      if (pressTimeoutRef.current !== null) {
        window.clearTimeout(pressTimeoutRef.current)
      }
    }
  }, [])

  const copy =
    locale === 'ar'
      ? {
        ceremonyTitle: 'يلا بينا',
        ceremonyHint: longPressRequired
          ? 'دوسي على القلب لمدة ثانيتين عشان تدخلي'
          : 'اضغطي على القلب عشان تروحي لمرحلة تاريخنا',
        fallbackMessage:
          'الحكاية دي مخبية جوا قلبي ليكي كتير... حطي إيدك على القلب ده.',
        dateTitle: 'تاريخنا الخاص',
        subtitle: 'لفي العداد واختاري اليوم اللي حكايتنا اتفتحت فيه لأول مرة.',
        day: 'اليوم',
        month: 'الشهر',
        year: 'السنة',
        submit: 'افتحي القفل',
        wrongDate: 'مش ده التاريخ الصح يا حبيبتي ركزي ✨',
        success: 'اتفتح! 💖',
      }
      : {
        ceremonyTitle: 'Ceremony',
        ceremonyHint: longPressRequired
          ? 'Hold the heart for 2 seconds to begin'
          : 'Tap the heart to continue to date entry',
        fallbackMessage:
          'This story is hidden in my heart for you... place your hand on the heart and open the gate.',
        dateTitle: 'Our Special Date',
        subtitle: 'Spin the heart dials and pick the date that unlocked us.',
        day: 'Day',
        month: 'Month',
        year: 'Year',
        submit: 'Unlock',
        wrongDate: 'That date is not the one yet... try again ✨',
        success: 'Unlocked! 💖',
      }

  const clearPressTimers = () => {
    if (pressIntervalRef.current !== null) {
      window.clearInterval(pressIntervalRef.current)
      pressIntervalRef.current = null
    }
    if (pressTimeoutRef.current !== null) {
      window.clearTimeout(pressTimeoutRef.current)
      pressTimeoutRef.current = null
    }
  }

  const finishCeremony = () => {
    clearPressTimers()
    setIsPressing(false)
    setPressProgress(1)
    window.setTimeout(() => {
      setStage('date_input')
    }, 240)
  }

  const startPress = () => {
    if (stage !== 'ceremony') return
    if (!longPressRequired) {
      finishCeremony()
      return
    }

    clearPressTimers()
    setIsPressing(true)
    pressStartAtRef.current = Date.now()

    pressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - pressStartAtRef.current
      setPressProgress(Math.min(elapsed / LONG_PRESS_MS, 1))
    }, 32)

    pressTimeoutRef.current = window.setTimeout(() => {
      finishCeremony()
    }, LONG_PRESS_MS)
  }

  const stopPress = () => {
    if (!longPressRequired) return
    if (stage !== 'ceremony') return
    if (pressProgress >= 1) return

    clearPressTimers()
    setIsPressing(false)
    setPressProgress(0)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isChecking || stage !== 'date_input') return

    setIsChecking(true)
    setError('')

    window.setTimeout(() => {
      const isMatch =
        day === unlockDate.day &&
        month === unlockDate.month &&
        year === unlockDate.year

      if (isMatch) {
        setStage('unlocking')
        setIsChecking(false)
        window.setTimeout(() => {
          onUnlock()
        }, 900)
        return
      }

      setError(copy.wrongDate)
      setShakeKey((value) => value + 1)
      setIsChecking(false)
    }, 420)
  }

  const summary = `${formatDigits(year, 4, locale)}-${formatDigits(month, 2, locale)}-${formatDigits(day, 2, locale)}`

  if (stage === 'ceremony') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-xl"
      >
        <GlassCard tone="elevated" className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.16em] text-[var(--hekaya-gold)] uppercase">
              {copy.ceremonyTitle}
            </p>
            <p className="text-sm text-[var(--hekaya-text-secondary)]">
              {ceremonyMessage ?? copy.fallbackMessage}
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
            <motion.button
              type="button"
              onMouseDown={startPress}
              onMouseUp={stopPress}
              onMouseLeave={stopPress}
              onTouchStart={startPress}
              onTouchEnd={stopPress}
              onTouchCancel={stopPress}
              whileTap={{ scale: 0.95 }}
              animate={isPressing ? { scale: [1, 1.06, 1] } : undefined}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[rgba(217,70,239,0.7)] bg-[radial-gradient(circle_at_35%_30%,rgba(217,70,239,0.42),rgba(31,12,56,0.9))] text-6xl text-[var(--hekaya-neon-soft)] shadow-[0_0_34px_rgba(217,70,239,0.4)]"
              aria-label="Ceremony heart"
            >
              ❤
            </motion.button>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(24,11,39,0.7)]">
              <motion.div
                animate={{ width: `${Math.round(pressProgress * 100)}%` }}
                className="h-full bg-[linear-gradient(90deg,var(--hekaya-neon-primary),var(--hekaya-gold))]"
              />
            </div>
            <p className="text-sm text-[var(--hekaya-text-muted)]">{copy.ceremonyHint}</p>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-xl"
    >
      <GlassCard tone="elevated" className="space-y-5">
        <div className="text-center">
          <h2 className="hekaya-font-display mt-1 text-2xl text-[var(--hekaya-text-primary)] sm:text-3xl">
            {copy.dateTitle}
          </h2>
          <p className="mt-2 text-sm text-[var(--hekaya-text-secondary)]">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <motion.div
            key={shakeKey}
            animate={error ? { x: [0, -9, 8, -5, 0] } : undefined}
            transition={{ duration: 0.35 }}
            className="relative mx-auto w-full max-w-[20rem]"
          >
            <div className="relative mx-auto flex h-[17.5rem] w-[19.6rem] items-center justify-center overflow-hidden rounded-[3rem] border border-[rgba(217,70,239,0.45)] bg-[radial-gradient(circle_at_30%_20%,rgba(217,70,239,0.35),transparent_42%),linear-gradient(155deg,rgba(50,28,84,0.94)_0%,rgba(28,14,49,0.95)_54%,rgba(16,8,30,0.98)_100%)] shadow-[0_24px_56px_rgba(7,1,22,0.56),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="relative z-10 flex gap-2">
                <DateDial
                  label={copy.year}
                  value={year}
                  min={years[0]!}
                  max={years[years.length - 1]!}
                  width="long"
                  locale={locale}
                  disabled={isChecking || stage === 'unlocking'}
                  onIncrease={() => setYear((value) => cycleValue(years, value, 1))}
                  onDecrease={() => setYear((value) => cycleValue(years, value, -1))}
                />
                <DateDial
                  label={copy.month}
                  value={month}
                  min={1}
                  max={12}
                  width="short"
                  locale={locale}
                  disabled={isChecking || stage === 'unlocking'}
                  onIncrease={() =>
                    setMonth((value) => cycleValue(MONTH_VALUES, value, 1))
                  }
                  onDecrease={() =>
                    setMonth((value) => cycleValue(MONTH_VALUES, value, -1))
                  }
                />
                <DateDial
                  label={copy.day}
                  value={day}
                  min={1}
                  max={dayValues.length}
                  width="short"
                  locale={locale}
                  disabled={isChecking || stage === 'unlocking'}
                  onIncrease={() => setDay((value) => cycleValue(dayValues, value, 1))}
                  onDecrease={() => setDay((value) => cycleValue(dayValues, value, -1))}
                />
              </div>
            </div>
          </motion.div>

          <div className="text-center">
            <p className="text-sm text-[var(--hekaya-text-muted)]">{summary}</p>
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-xl border border-[rgba(248,113,113,0.4)] bg-[rgba(92,20,32,0.35)] px-4 py-2 text-center text-sm text-[#ffd9df]"
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <div className="mx-auto w-fit">
            <NeonButton type="submit" wide={false} disabled={isChecking || stage === 'unlocking'}>
              {stage === 'unlocking' ? copy.success : copy.submit}
            </NeonButton>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  )
}
