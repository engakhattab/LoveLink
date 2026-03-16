import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { Chapter, ChapterProgress, HekayaLocale } from '../../../types/hekaya'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'
import { ChapterCard } from './ChapterCard'

interface ChapterHubProps {
  chapters: Chapter[]
  progress: ChapterProgress[]
  locale: HekayaLocale
  finalCelebrationUrl: string
  onSelectChapter: (id: string) => void
  onResetProgress?: () => void
}

interface ChapterAccessItem {
  chapter: Chapter
  progress?: ChapterProgress
  accessible: boolean
  locked: boolean
  lockReason?: string
  showGameIcon: boolean
}

export function ChapterHub({
  chapters,
  progress,
  locale,
  finalCelebrationUrl,
  onSelectChapter,
  onResetProgress,
}: ChapterHubProps) {
  const accessList: ChapterAccessItem[] = useMemo(() => {
    const getChapterProgress = (chapterId: string) =>
      progress.find((item) => item.chapterId === chapterId)
    const isViewed = (chapterId: string) =>
      Boolean(getChapterProgress(chapterId)?.viewed)

    return chapters.map((chapter, index) => {
      const chapterProgress = getChapterProgress(chapter.id)

      if (index < 2) {
        return {
          chapter,
          progress: chapterProgress,
          accessible: true,
          locked: false,
          showGameIcon: Boolean(chapter.xoGameLock?.enabled),
        }
      }

      if (chapter.id === 'chapter_3') {
        const chapter1Viewed = isViewed('chapter_1')
        const chapter2Viewed = isViewed('chapter_2')
        const accessible = chapter1Viewed && chapter2Viewed
        return {
          chapter,
          progress: chapterProgress,
          accessible,
          locked: !accessible,
          lockReason: accessible
            ? undefined
            : locale === 'ar'
              ? 'كملي الفصل الأول والثاني الأول'
              : 'Complete Chapters 1 and 2 first',
          showGameIcon: true,
        }
      }

      const previousChapter = chapters[index - 1]
      const previousViewed = previousChapter ? isViewed(previousChapter.id) : true
      return {
        chapter,
        progress: chapterProgress,
        accessible: previousViewed,
        locked: !previousViewed,
        lockReason: previousViewed
          ? undefined
          : locale === 'ar'
            ? 'كملي الفصل السابق الأول'
            : 'Complete the previous chapter first',
        showGameIcon: Boolean(chapter.xoGameLock?.enabled),
      }
    })
  }, [chapters, progress, locale])

  const viewedCount = progress.filter((item) => item.viewed).length
  const completionPercent =
    chapters.length === 0 ? 0 : Math.round((viewedCount / chapters.length) * 100)
  const viewedChapterSet = new Set(
    progress.filter((item) => item.viewed).map((item) => item.chapterId),
  )
  const allChaptersCompleted =
    chapters.length > 0 &&
    chapters.every((chapter) => viewedChapterSet.has(chapter.id))

  const suggestedChapter =
    accessList.find((item) => item.accessible && !item.progress?.viewed) ??
    accessList.find((item) => item.accessible)

  const copy =
    locale === 'ar'
      ? {
        title: 'فصول الحكاية',
        subtitle: 'الأبواب بتتفتح بالتدريج... كل فصل له وقته.',
        progressLabel: 'تقدم المشاهدة',
        continueCta: 'كملي من آخر محطة',
        reset: 'إعادة التقدم',
      }
      : {
        title: 'Story Chapters',
        subtitle: 'Chapters unlock in sequence and each one has its own gate.',
        progressLabel: 'Viewing Progress',
        continueCta: 'Continue Journey',
        reset: 'Reset Progress',
      }

  const fireworksCopy =
    locale === 'ar'
      ? {
        start: '🎆 ابدأ العرض النهائي',
        hint: 'عرض خاص من الألعاب النارية',
      }
      : {
        start: 'Start Final Fireworks',
        hint: 'A special celebration is ready for you.',
      }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <GlassCard tone="elevated" className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="hekaya-font-display text-2xl text-[var(--hekaya-text-primary)]">
              {copy.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--hekaya-text-secondary)]">
              {copy.subtitle}
            </p>
          </div>
          <div className="min-w-[10rem]">
            <p className="mb-1 text-xs tracking-[0.12em] text-[var(--hekaya-text-muted)] uppercase">
              {copy.progressLabel}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-[rgba(22,10,38,0.7)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-[linear-gradient(90deg,var(--hekaya-neon-primary),var(--hekaya-gold))]"
              />
            </div>
            <p className="mt-1 text-xs text-[var(--hekaya-text-muted)]">{completionPercent}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <NeonButton
            wide={false}
            disabled={!suggestedChapter}
            onClick={() => {
              if (suggestedChapter?.accessible) onSelectChapter(suggestedChapter.chapter.id)
            }}
          >
            {copy.continueCta}
          </NeonButton>
          {onResetProgress ? (
            <NeonButton variant="gold" wide={false} onClick={onResetProgress}>
              {copy.reset}
            </NeonButton>
          ) : null}
        </div>
      </GlassCard>

      <div className="grid gap-3 sm:grid-cols-2">
        {accessList.map((item, index) => (
          <ChapterCard
            key={item.chapter.id}
            chapter={item.chapter}
            index={index}
            progress={item.progress}
            locale={locale}
            locked={item.locked}
            lockReason={item.lockReason}
            showGameIcon={item.showGameIcon}
            isRecommended={suggestedChapter?.chapter.id === item.chapter.id}
            onClick={() => {
              if (item.accessible) onSelectChapter(item.chapter.id)
            }}
          />
        ))}
      </div>

      {allChaptersCompleted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              const popup = window.open(
                finalCelebrationUrl,
                '_blank',
                'noopener,noreferrer',
              )
              if (!popup) {
                window.alert(
                  locale === 'ar'
                    ? 'لم نتمكن من فتح نافذة جديدة. من فضلك فعّل السماح بالنوافذ المنبثقة لهذا الموقع.'
                    : 'We could not open a new window. Please allow popups for this site.',
                )
              }
            }}
            className="rounded-2xl bg-[linear-gradient(90deg,#d946ef,#a855f7)] px-10 py-4 text-xl font-bold text-white shadow-[0_12px_30px_rgba(217,70,239,0.5)] transition hover:shadow-[0_16px_36px_rgba(217,70,239,0.6)] sm:px-12 sm:py-5 sm:text-2xl"
          >
            {fireworksCopy.start}
          </motion.button>
          <p className="mt-4 text-sm text-[var(--hekaya-text-secondary)]">
            {fireworksCopy.hint}
          </p>
        </motion.div>
      ) : null}
    </motion.div>
  )
}
