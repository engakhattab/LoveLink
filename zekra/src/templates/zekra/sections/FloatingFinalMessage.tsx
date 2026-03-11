import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { GlowButton } from '../../../shared/GlowButton'
import { SectionBlock } from '../../../shared/SectionBlock'
import type { ZekraLocale } from '../../../types/zekra'
import type { ZekraCopy } from '../copy'

interface FloatingFinalMessageProps {
  finalMessage: string
  finalLines?: string[]
  locale: ZekraLocale
  copy: ZekraCopy
}

function splitToLines(finalMessage: string, finalLines?: string[]) {
  const providedLines = (finalLines ?? [])
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  if (providedLines.length > 0) {
    return providedLines
  }

  const fromBreaks = finalMessage
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  if (fromBreaks.length > 1) {
    return fromBreaks
  }

  const sentenceLines =
    finalMessage
      .match(/[^.!؟]+[.!؟]?/g)
      ?.map((line) => line.trim())
      .filter((line) => line.length > 0) ?? []
  if (sentenceLines.length > 1) {
    return sentenceLines
  }

  const words = finalMessage.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 8) {
    return [finalMessage.trim()]
  }

  const chunkSize = Math.ceil(words.length / 3)
  const chunks = [
    words.slice(0, chunkSize).join(' '),
    words.slice(chunkSize, chunkSize * 2).join(' '),
    words.slice(chunkSize * 2).join(' '),
  ]

  return chunks.map((line) => line.trim()).filter((line) => line.length > 0)
}

export function FloatingFinalMessage({
  finalMessage,
  finalLines,
  locale,
  copy,
}: FloatingFinalMessageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isArabic = locale === 'ar'

  const messageLines = useMemo(
    () => splitToLines(finalMessage, finalLines),
    [finalLines, finalMessage],
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [isOpen])

  return (
    <>
      <SectionBlock
        id="final"
        eyebrow={copy.finalKicker}
        title={copy.finalTitle}
        accent="gold"
        className="text-center"
      >
        <div className="mx-auto mb-4 max-w-xs">
          <GlowButton onClick={() => setIsOpen(true)}>{copy.finalButtonClosed}</GlowButton>
        </div>
      </SectionBlock>

      {isMounted
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <motion.section
                  key="final-fullscreen-window"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[999] overflow-y-auto bg-[linear-gradient(180deg,rgba(28,8,36,0.985),rgba(12,4,19,0.99))]"
                >
                  <div className="mx-auto flex min-h-screen w-full max-w-[46rem] flex-col px-4 py-6 sm:px-6 sm:py-8">
                    <div className="mb-6 flex items-center">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-[rgba(255,190,85,0.35)] bg-[rgba(255,255,255,0.06)] px-4 text-sm text-[var(--ink-main)] transition hover:bg-[rgba(255,255,255,0.12)]"
                      >
                        <span aria-hidden>←</span>
                        {copy.finalReturnButton}
                      </button>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.99 }}
                      transition={{ duration: 0.46, ease: [0.2, 0.65, 0.3, 1] }}
                      className="relative flex-1 rounded-[32px]"
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0, 6, 0] }}
                        transition={{ duration: 4.6, ease: 'easeInOut', repeat: Infinity }}
                        className="relative h-full overflow-hidden rounded-[32px] border border-[rgba(255,190,85,0.46)] bg-[linear-gradient(170deg,rgba(57,18,49,0.96),rgba(21,7,27,0.97))] px-5 py-8 shadow-[0_30px_68px_rgba(255,70,158,0.34)] sm:px-7 sm:py-10"
                      >
                        <span className="absolute -top-14 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[rgba(255,190,85,0.2)] blur-2xl" />
                        <p className="mb-2 text-center text-2xl text-[var(--rose-main)]">❤</p>
                        <h3
                          className={`mb-5 text-center text-[var(--ink-main)] ${isArabic ? 'font-ar-thuluth text-[2.35rem] leading-[1.3]' : 'font-script text-5xl leading-none'}`}
                        >
                          {copy.finalTitle}
                        </h3>
                        <div className="heart-divider mb-6" />

                        <motion.div
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: {},
                            show: {
                              transition: {
                                delayChildren: 0.38,
                                staggerChildren: 0.55,
                              },
                            },
                          }}
                          className="mx-auto max-w-[30rem] space-y-3 text-center"
                        >
                          {messageLines.map((line, index) => (
                            <motion.p
                              key={`${line}-${index}`}
                              variants={{
                                hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
                                show: { opacity: 1, y: 0, filter: 'blur(0px)' },
                              }}
                              transition={{ duration: 0.72, ease: [0.2, 0.65, 0.3, 1] }}
                              className={`text-center text-[var(--ink-main)] ${isArabic ? 'font-ar-body text-[1.12rem] leading-8' : 'text-[1rem] leading-8'}`}
                            >
                              {line}
                            </motion.p>
                          ))}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.section>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
