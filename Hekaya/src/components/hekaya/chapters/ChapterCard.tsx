import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { Chapter, ChapterProgress, HekayaLocale } from '../../../types/hekaya'

interface ChapterCardProps {
  chapter: Chapter
  index: number
  progress?: ChapterProgress
  locale: HekayaLocale
  locked: boolean
  lockReason?: string
  showGameIcon?: boolean
  isRecommended?: boolean
  onClick: () => void
}

export function ChapterCard({
  chapter,
  index,
  progress,
  locale,
  locked,
  lockReason,
  showGameIcon = false,
  isRecommended = false,
  onClick,
}: ChapterCardProps) {
  const viewed = Boolean(progress?.viewed)
  const xoDone = Boolean(progress?.xoGameCompleted)

  const statusText = locked
    ? locale === 'ar'
      ? 'مقفول'
      : 'Locked'
    : viewed
      ? locale === 'ar'
        ? 'تمت المشاهدة'
        : 'Viewed'
      : locale === 'ar'
        ? 'جديد'
        : 'New'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={locked ? undefined : { y: -4 }}
      whileTap={locked ? undefined : { scale: 0.99 }}
      className={clsx(
        'relative overflow-hidden rounded-2xl border p-4 text-start transition',
        locked
          ? 'cursor-not-allowed border-[rgba(167,139,250,0.2)] bg-[rgba(18,10,32,0.35)] opacity-75'
          : 'border-[rgba(217,70,239,0.35)] bg-[rgba(27,14,47,0.6)] hover:border-[rgba(217,70,239,0.7)] hover:shadow-[0_10px_24px_rgba(217,70,239,0.26)]',
        isRecommended && !locked ? 'ring-2 ring-[rgba(251,191,36,0.45)]' : '',
      )}
      disabled={locked}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs tracking-[0.14em] text-[var(--hekaya-text-muted)] uppercase">
          {locale === 'ar' ? `الفصل ${index + 1}` : `Chapter ${index + 1}`}
        </span>
        <span
          className={clsx(
            'rounded-full border px-2 py-1 text-[0.64rem] tracking-[0.12em] uppercase',
            viewed
              ? 'border-[rgba(52,211,153,0.5)] text-[var(--hekaya-success)]'
              : 'border-[rgba(167,139,250,0.45)] text-[var(--hekaya-text-muted)]',
          )}
        >
          {statusText}
        </span>
      </div>

      <h3 className="hekaya-font-display mt-3 text-lg leading-7 text-[var(--hekaya-text-primary)]">
        {chapter.title}
      </h3>

      <p className="mt-2 text-sm text-[var(--hekaya-text-secondary)]">{chapter.narrative}</p>

      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--hekaya-text-muted)]">
        {locked ? <span>🔒</span> : null}
        {!locked && showGameIcon && !xoDone ? <span>🎮</span> : null}
        {!locked && showGameIcon && xoDone ? <span>✓</span> : null}
        <span>{lockReason ?? chapter.dateRange}</span>
      </div>

      {isRecommended && !locked ? (
        <span className="absolute inset-x-0 bottom-0 h-1 bg-[linear-gradient(90deg,rgba(251,191,36,0),rgba(251,191,36,0.75),rgba(251,191,36,0))]" />
      ) : null}
    </motion.button>
  )
}
