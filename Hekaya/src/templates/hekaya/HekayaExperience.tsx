import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChapterHub } from '../../components/hekaya/chapters/ChapterHub'
import { ChapterView } from '../../components/hekaya/chapters/ChapterView'
import FinalReveal from '../../components/hekaya/final/FinalReveal'
import { HeartDateGate } from '../../components/hekaya/unlock/HeartDateGate'
import { GlassCard } from '../../components/shared/GlassCard'
import { NeonButton } from '../../components/shared/NeonButton'
import { StarField } from '../../components/shared/StarField'
import { useChapterProgress } from '../../hooks/useChapterProgress'
import type { HekayaConfig, HekayaStage } from '../../types/hekaya'

interface HekayaExperienceProps {
  config: HekayaConfig
}

const revealTransition = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1] as const,
}

export function HekayaExperience({ config }: HekayaExperienceProps) {
  const [stage, setStage] = useState<HekayaStage>('locked_heart')
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const isUnlocked = stage === 'unlocked'

  const {
    progress,
    reflectedQuestionIds,
    continueChapterId,
    markChapterViewed,
    markXOGameCompleted,
    markQuestionReflected,
    resetProgress,
    getChapterProgress,
    isChapterViewed,
    isQuestionReflected,
  } = useChapterProgress(config.chapters)

  const activeChapterIndex = config.chapters.findIndex(
    (chapter) => chapter.id === activeChapterId,
  )
  const activeChapter =
    activeChapterIndex >= 0 ? config.chapters[activeChapterIndex] : null

  useEffect(() => {
    document.body.dataset.locale = config.locale
    document.documentElement.lang = config.locale === 'ar' ? 'ar' : 'en'
    document.documentElement.dir = config.locale === 'ar' ? 'rtl' : 'ltr'

    return () => {
      delete document.body.dataset.locale
      document.documentElement.removeAttribute('dir')
    }
  }, [config.locale])

  useEffect(() => {
    if (stage !== 'entering') return

    const timeout = window.setTimeout(() => {
      setStage('unlocked')
    }, 1200)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [stage])

  useEffect(() => {
    if (!activeChapterId) return
    const exists = config.chapters.some((chapter) => chapter.id === activeChapterId)
    if (!exists) setActiveChapterId(null)
  }, [activeChapterId, config.chapters])

  // Auto-scroll للأعلى عند تغيير الفصل
  useEffect(() => {
    if (activeChapterId) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeChapterId])

  const copy =
    config.locale === 'ar'
      ? {
        title: `رحلة ${config.receiverName} ❤️ ${config.senderName}`,
        start: 'ابدئي الحكاية',
        locked: 'لسه فيه كمان قفل😂',
        unlocked: 'شطورة فتحتي حكايتنا',
        unlockHint:
          'المدخل الآن ببوابة القلب والتاريخ فقط... أما التحدي فهو جوه الفصل الثالث.',
        entering: 'أهلا بيكي في الحكاية...',
        done:
          'تم تعديل النظام: الفصل الثالث بيطلب لعبة X-O داخل الفصل نفسه قبل عرض المحتوى.',
      }
      : {
        title: `${config.receiverName} & ${config.senderName}'s Story`,
        start: 'Start Story',
        locked: 'Still Locked',
        unlocked: 'Experience Unlocked',
        unlockHint:
          'Entry now uses the heart/date ritual only. The X-O challenge lives inside Chapter 3.',
        entering: 'Welcome into the story...',
        done:
          'Unlock system updated: Chapter 3 now requires an in-chapter X-O game before content.',
      }

  const openStartChapter = () => {
    if (!isUnlocked) return
    const target = continueChapterId ?? config.chapters[0]?.id
    if (target) setActiveChapterId(target)
  }

  const handleNavigate = (destination: string) => {
    if (destination === 'final-message') {
      setStage('final_reveal')
      setActiveChapterId(null)
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <StarField count={96} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
        >
          <GlassCard tone="elevated" className="space-y-4">
            <p className="hekaya-font-accent text-sm tracking-[0.2em] text-[var(--hekaya-text-muted)] uppercase">
              Hekaya | حكاية
            </p>
            <h1 className="hekaya-font-display text-3xl leading-tight text-[var(--hekaya-text-primary)] sm:text-5xl">
              {copy.title}
            </h1>
            <p className="max-w-3xl text-sm text-[var(--hekaya-text-secondary)] sm:text-base">
              {config.introLine}
            </p>
            <div className="hekaya-divider my-4" />
            <div className="flex flex-wrap gap-3">
              <NeonButton wide={false} disabled={!isUnlocked} onClick={openStartChapter}>
                {copy.start}
              </NeonButton>
              <NeonButton variant="gold" wide={false}>
                {isUnlocked ? copy.unlocked : copy.locked}
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>

        {stage === 'locked_heart' ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.1 }}
            >
              <HeartDateGate
                unlockDate={config.unlock.unlockDate}
                ceremonyMessage={config.unlock.ceremonyMessage}
                longPressRequired={config.unlock.longPressRequired}
                locale={config.locale}
                onUnlock={() => setStage('entering')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.2 }}
            >
              <GlassCard className="space-y-2">
                <p className="text-sm text-[var(--hekaya-text-secondary)]">
                  {copy.unlockHint}
                </p>
              </GlassCard>
            </motion.div>
          </>
        ) : null}

        {stage === 'entering' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard tone="elevated" className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="hekaya-font-display text-xl text-[var(--hekaya-text-primary)] sm:text-2xl"
              >
                {copy.entering}
              </motion.p>
            </GlassCard>
          </motion.div>
        ) : null}

        {stage === 'final_reveal' ? (
          <FinalReveal
            config={config.finalReveal}
            locale={config.locale}
            onComplete={() => {
              setStage('unlocked')
              setActiveChapterId(null)
            }}
          />
        ) : null}

        {stage === 'unlocked' ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.1 }}
            className="space-y-4"
          >
            <GlassCard className="space-y-2">
              <p className="text-sm text-[var(--hekaya-success)]">{copy.done}</p>
              <p className="text-xs text-[var(--hekaya-text-muted)]">
                {config.locale === 'ar'
                  ? `الأسئلة المتأملة: ${reflectedQuestionIds.length}`
                  : `Reflected questions: ${reflectedQuestionIds.length}`}
              </p>
            </GlassCard>

            {activeChapter ? (
              <ChapterView
                key={activeChapter.id}
                chapter={activeChapter}
                chapterProgress={getChapterProgress(activeChapter.id)}
                locale={config.locale}
                isCompleted={isChapterViewed(activeChapter.id)}
                isQuestionAcknowledged={
                  activeChapter.question
                    ? isQuestionReflected(activeChapter.question.id)
                    : true
                }
                onAcknowledgeQuestion={markQuestionReflected}
                onXOGameComplete={markXOGameCompleted}
                onComplete={() => markChapterViewed(activeChapter.id)}
                onBack={() => setActiveChapterId(null)}
                onPrevious={
                  activeChapterIndex > 0
                    ? () =>
                      setActiveChapterId(config.chapters[activeChapterIndex - 1]!.id)
                    : undefined
                }
                onNext={
                  activeChapterIndex >= 0 &&
                    activeChapterIndex < config.chapters.length - 1
                    ? () =>
                      setActiveChapterId(config.chapters[activeChapterIndex + 1]!.id)
                    : undefined
                }
              />
            ) : (
              <ChapterHub
                chapters={config.chapters}
                progress={progress}
                locale={config.locale}
                finalCelebrationUrl={config.finalCelebrationUrl}
                onSelectChapter={setActiveChapterId}
                onResetProgress={resetProgress}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        ) : null}
      </div>
    </main>
  )
}
