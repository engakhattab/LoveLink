import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { Chapter, ChapterProgress, HekayaLocale } from '../../../types/hekaya'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'
import { ChapterXOGame } from './ChapterXOGame'
import { QuestionMoment } from './QuestionMoment'

interface ChapterViewProps {
  chapter: Chapter
  chapterProgress?: ChapterProgress
  locale: HekayaLocale
  onComplete: () => void
  onXOGameComplete: (chapterId: string) => void
  onBack: () => void
  onNext?: () => void
  onPrevious?: () => void
  isCompleted?: boolean
  isQuestionAcknowledged?: boolean
  onAcknowledgeQuestion?: (questionId: string) => void
}

type ChapterStage = 'locked' | 'unlocked'

export function ChapterView({
  chapter,
  chapterProgress,
  locale,
  onComplete,
  onXOGameComplete,
  onBack,
  onNext,
  onPrevious,
  isCompleted = false,
  isQuestionAcknowledged = true,
  onAcknowledgeQuestion,
}: ChapterViewProps) {
  const [chapterStage, setChapterStage] = useState<ChapterStage>(() => {
    if (chapter.xoGameLock?.enabled) {
      return chapterProgress?.xoGameCompleted ? 'unlocked' : 'locked'
    }
    return 'unlocked'
  })

  useEffect(() => {
    if (chapter.xoGameLock?.enabled) {
      setChapterStage(chapterProgress?.xoGameCompleted ? 'unlocked' : 'locked')
      return
    }
    setChapterStage('unlocked')
  }, [chapter.id, chapter.xoGameLock?.enabled, chapterProgress?.xoGameCompleted])

  const copy = useMemo(
    () =>
      locale === 'ar'
        ? {
            chapterLabel: 'الفصل',
            mainMessage: 'رسالة الفصل',
            markViewed: isCompleted ? 'تمت المشاهدة ✓' : 'تأكيد مشاهدة الفصل',
            back: 'الرجوع للفهرس',
            previous: 'الفصل السابق',
            next: 'الفصل التالي',
            voice: 'رسالة صوتية',
            questionGate:
              'لازم تتأملي في السؤال الأول قبل ما نكمل أو نعتبر الفصل مكتمل.',
          }
        : {
            chapterLabel: 'Chapter',
            mainMessage: 'Main Message',
            markViewed: isCompleted ? 'Viewed ✓' : 'Mark Chapter as Viewed',
            back: 'Back to Hub',
            previous: 'Previous',
            next: 'Next',
            voice: 'Voice Note',
            questionGate:
              'Please reflect on the question first before continuing the chapter flow.',
          },
    [isCompleted, locale],
  )

  const question = chapter.question
  const hasQuestion = Boolean(question)
  const questionPending = hasQuestion && !isQuestionAcknowledged

  if (chapterStage === 'locked' && chapter.xoGameLock?.enabled) {
    return (
      <ChapterXOGame
        config={chapter.xoGameLock}
        locale={locale}
        onWin={() => {
          onXOGameComplete(chapter.id)
          setChapterStage('unlocked')
        }}
      />
    )
  }

  const renderQuestionAt = (position: 'start' | 'middle' | 'end') => {
    if (!question) return null
    if (question.position !== position) return null

    return (
      <QuestionMoment
        question={question.question}
        acknowledged={isQuestionAcknowledged}
        locale={locale}
        onAcknowledge={() => onAcknowledgeQuestion?.(question.id)}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <GlassCard tone="elevated" className="space-y-5">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.14em] text-[var(--hekaya-text-muted)] uppercase">
            {copy.chapterLabel}
          </p>
          <h2 className="hekaya-font-display text-2xl text-[var(--hekaya-text-primary)] sm:text-3xl">
            {chapter.title}
          </h2>
          {chapter.dateRange ? (
            <p className="text-sm text-[var(--hekaya-text-muted)]">{chapter.dateRange}</p>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-[var(--hekaya-text-secondary)] sm:text-base">
          {chapter.narrative}
        </p>
      </GlassCard>

      {renderQuestionAt('start')}

      <GlassCard className="space-y-4">
        <h3 className="hekaya-font-display text-lg text-[var(--hekaya-text-primary)] sm:text-xl">
          {copy.mainMessage}
        </h3>
        <p className="text-sm leading-7 text-[var(--hekaya-text-primary)] sm:text-base">
          {chapter.message}
        </p>
      </GlassCard>

      <GlassCard className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {chapter.photos.map((photo, index) => (
            <figure
              key={`${photo.src}-${index}`}
              className="overflow-hidden rounded-2xl border border-[rgba(167,139,250,0.25)] bg-[rgba(20,10,35,0.4)]"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <figcaption className="px-3 py-2 text-sm text-[var(--hekaya-text-secondary)]">
                {photo.caption ?? photo.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </GlassCard>

      {renderQuestionAt('middle')}

      {chapter.voiceNote ? (
        <GlassCard className="space-y-2">
          <h4 className="text-sm tracking-[0.14em] text-[var(--hekaya-text-muted)] uppercase">
            {copy.voice}
          </h4>
          <p className="text-sm text-[var(--hekaya-text-secondary)]">
            {chapter.voiceNote.label}
          </p>
          <audio controls preload="none" src={chapter.voiceNote.src} className="w-full" />
        </GlassCard>
      ) : null}

      {renderQuestionAt('end')}

      <GlassCard className="space-y-3">
        {questionPending ? (
          <p className="rounded-xl border border-[rgba(251,191,36,0.35)] bg-[rgba(68,39,8,0.32)] px-3 py-2 text-sm text-[var(--hekaya-star-bright)]">
            {copy.questionGate}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <NeonButton
            wide={false}
            onClick={() => {
              if (questionPending) return
              onComplete()
            }}
            disabled={questionPending}
          >
            {copy.markViewed}
          </NeonButton>
          <NeonButton variant="gold" wide={false} onClick={onBack}>
            {copy.back}
          </NeonButton>
        </div>
        <div className="flex flex-wrap gap-2">
          <NeonButton wide={false} onClick={onPrevious} disabled={!onPrevious}>
            {copy.previous}
          </NeonButton>
          <NeonButton
            variant="gold"
            wide={false}
            onClick={onNext}
            disabled={!onNext || questionPending}
          >
            {copy.next}
          </NeonButton>
        </div>
      </GlassCard>
    </motion.div>
  )
}
