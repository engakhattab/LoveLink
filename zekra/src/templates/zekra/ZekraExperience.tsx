import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { AmbientRomance } from '../../shared/AmbientRomance'
import { GlassPanel } from '../../shared/GlassPanel'
import type { ZekraConfig } from '../../types/zekra'
import { zekraCopy } from './copy'
import { HeartDateGate } from './flow/HeartDateGate'
import { PandaBridge } from './flow/PandaBridge'
import { FloatingFinalMessage } from './sections/FloatingFinalMessage'
import { HeroSection } from './sections/HeroSection'
import { LoveCounter } from './sections/LoveCounter'
import { MessageDeck } from './sections/MessageDeck'
import { PhotoMemories } from './sections/PhotoMemories'

type ExperienceStage = 'locked' | 'bridge' | 'unlocked'

interface ZekraExperienceProps {
  config: ZekraConfig
}

function isValidConfig(config: ZekraConfig) {
  const validDate =
    Number.isInteger(config.unlockDate.year) &&
    Number.isInteger(config.unlockDate.month) &&
    Number.isInteger(config.unlockDate.day) &&
    config.unlockDate.month >= 1 &&
    config.unlockDate.month <= 12 &&
    config.unlockDate.day >= 1 &&
    config.unlockDate.day <= 31

  const validMessages =
    Array.isArray(config.messages) &&
    config.messages.length === 3 &&
    config.messages.every((message) => message.body && message.title)

  const validPhotos =
    Array.isArray(config.photos) &&
    config.photos.length === 6 &&
    config.photos.every((photo) => photo.src && photo.caption)

  return validDate && validMessages && validPhotos
}

export function ZekraExperience({ config }: ZekraExperienceProps) {
  const [stage, setStage] = useState<ExperienceStage>('locked')
  const copy = useMemo(() => zekraCopy[config.locale], [config.locale])
  const direction = config.locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = config.locale
    document.documentElement.dir = direction
    document.body.dataset.locale = config.locale

    if (config.theme) {
      const root = document.documentElement
      if (config.theme.roseMain) {
        root.style.setProperty('--rose-main', config.theme.roseMain)
      }
      if (config.theme.roseDeep) {
        root.style.setProperty('--rose-deep', config.theme.roseDeep)
      }
      if (config.theme.goldAccent) {
        root.style.setProperty('--gold-accent', config.theme.goldAccent)
      }
      if (config.theme.bgVoid) {
        root.style.setProperty('--bg-void', config.theme.bgVoid)
      }
    }

    return () => {
      delete document.body.dataset.locale
    }
  }, [config.locale, config.theme, direction])

  if (!isValidConfig(config)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[34rem] items-center px-5 py-8">
        <GlassPanel accent="rose" className="w-full">
          <h1 className="mb-2 text-3xl text-[var(--ink-main)]">
            {copy.invalidConfigTitle}
          </h1>
          <p className="text-[0.96rem] text-[var(--ink-soft)]">
            {copy.invalidConfigText}
          </p>
        </GlassPanel>
      </main>
    )
  }

  return (
    <div dir={direction} className="relative min-h-screen overflow-x-clip">
      <AmbientRomance mode={stage === 'locked' ? 'lock' : 'default'} />

      <div className="relative z-10 mx-auto w-full max-w-[66rem] px-4 pt-5 pb-16 sm:px-8 sm:pt-8">
        <AnimatePresence mode="wait">
          {stage === 'locked' ? (
            <motion.div key="locked" exit={{ opacity: 0, y: -8 }}>
              <HeartDateGate
                receiverName={config.receiverName}
                senderName={config.senderName}
                expectedDate={config.unlockDate}
                locale={config.locale}
                copy={copy}
                onUnlocked={() => setStage('bridge')}
              />
            </motion.div>
          ) : null}

          {stage === 'bridge' ? (
            <motion.div key="bridge" exit={{ opacity: 0 }}>
              <PandaBridge
                copy={copy}
                gifSrc={config.loadingGifSrc}
                gifAlt={config.loadingGifAlt}
                onComplete={() => setStage('unlocked')}
              />
            </motion.div>
          ) : null}

          {stage === 'unlocked' ? (
            <motion.main
              key="unlocked"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.65, 0.3, 1] }}
              className="space-y-5 pt-8 sm:space-y-6 sm:pt-10"
            >
              <HeroSection
                receiverName={config.receiverName}
                senderName={config.senderName}
                introLine={config.introLine}
                locale={config.locale}
                copy={copy}
              />
              <LoveCounter
                unlockDate={config.unlockDate}
                locale={config.locale}
                copy={copy}
              />
              <MessageDeck
                messages={config.messages}
                locale={config.locale}
                copy={copy}
              />
              <PhotoMemories
                photos={config.photos}
                locale={config.locale}
                copy={copy}
              />
              <FloatingFinalMessage
                finalMessage={config.finalFloatingMessage}
                finalLines={config.finalFloatingLines}
                locale={config.locale}
                copy={copy}
              />
            </motion.main>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
