import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AmbientParticles } from '../../shared/AmbientParticles'
import { GlassCard } from '../../shared/GlassCard'
import type { GiftTemplateConfig } from '../../types/gift'
import { lamsaCopy } from './copy'
import { AnticipationReveal } from './flow/AnticipationReveal'
import { PasswordGate } from './flow/PasswordGate'
import { ClosingSection } from './sections/ClosingSection'
import { DateSection } from './sections/DateSection'
import { MessageSection } from './sections/MessageSection'
import { PhotosSection } from './sections/PhotosSection'
import { WelcomeSection } from './sections/WelcomeSection'

type ExperienceStage = 'locked' | 'revealing' | 'unlocked'

interface LamsaExperienceProps {
  config: GiftTemplateConfig
}

function hasExactlyFourPhotos(config: GiftTemplateConfig) {
  return (
    Array.isArray(config.photos) &&
    config.photos.length === 4 &&
    config.photos.every((photo) => Boolean(photo))
  )
}

export function LamsaExperience({ config }: LamsaExperienceProps) {
  const [stage, setStage] = useState<ExperienceStage>('locked')
  const copy = lamsaCopy[config.locale]
  const direction = config.locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = config.locale
    document.documentElement.dir = direction
    document.body.dataset.locale = config.locale

    return () => {
      delete document.body.dataset.locale
    }
  }, [config.locale, direction])

  if (!hasExactlyFourPhotos(config)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[34rem] items-center px-5 py-8">
        <GlassCard className="w-full">
          <h1 className="font-display mb-2 text-3xl text-[var(--ink-main)]">
            {copy.invalidConfigTitle}
          </h1>
          <p className="text-[0.96rem] text-[var(--ink-soft)]">
            {copy.invalidConfigText}
          </p>
        </GlassCard>
      </main>
    )
  }

  return (
    <div dir={direction} className="relative min-h-screen overflow-x-clip">
      <AmbientParticles />

      <div className="relative z-10 mx-auto w-full max-w-[64rem] px-4 pt-4 pb-14 sm:px-8 sm:pt-8">
        <AnimatePresence mode="wait">
          {stage === 'locked' ? (
            <motion.div key="locked" exit={{ opacity: 0, y: -12 }}>
              <PasswordGate
                receiverName={config.receiverName}
                expectedPassword={config.password}
                copy={copy}
                onUnlocked={() => setStage('revealing')}
              />
            </motion.div>
          ) : null}

          {stage === 'revealing' ? (
            <motion.div key="revealing" exit={{ opacity: 0 }}>
              <AnticipationReveal copy={copy} onComplete={() => setStage('unlocked')} />
            </motion.div>
          ) : null}

          {stage === 'unlocked' ? (
            <motion.main
              key="unlocked"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease: [0.2, 0.65, 0.3, 1] }}
              className="space-y-4 pt-12 sm:space-y-5 sm:pt-16"
            >
              <WelcomeSection
                receiverName={config.receiverName}
                senderName={config.senderName}
                copy={copy}
              />
              <DateSection
                meaningfulDate={config.meaningfulDate}
                locale={config.locale}
                copy={copy}
              />
              <PhotosSection photos={config.photos} copy={copy} />
              <MessageSection message={config.message} copy={copy} />
              <ClosingSection senderName={config.senderName} copy={copy} />
            </motion.main>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
