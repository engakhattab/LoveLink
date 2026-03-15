import { AnimatePresence, type PanInfo, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { SectionBlock } from '../../../shared/SectionBlock'
import type { ZekraLocale, ZekraMessageSet } from '../../../types/zekra'
import type { ZekraCopy } from '../copy'

interface MessageDeckProps {
  messages: ZekraMessageSet
  locale: ZekraLocale
  copy: ZekraCopy
}

const CARD_ACCENTS = ['rose', 'gold', 'rose'] as const
const SWIPE_THRESHOLD = 68

function wrapIndex(index: number, length: number) {
  const wrapped = index % length
  return wrapped < 0 ? wrapped + length : wrapped
}

export function MessageDeck({ messages, locale, copy }: MessageDeckProps) {
  const [revealed, setRevealed] = useState([false, false, false])
  const [page, setPage] = useState(0)
  const [slideDirection, setSlideDirection] = useState(0)
  const dragDistanceRef = useRef(0)

  const isArabic = locale === 'ar'
  const activeIndex = wrapIndex(page, messages.length)
  const activeMessage = messages[activeIndex]
  const activeAccent = CARD_ACCENTS[activeIndex]

  const cardClassByAccent = {
    rose: 'border-[rgba(255,93,172,0.44)] bg-[linear-gradient(155deg,rgba(52,15,58,0.95),rgba(30,8,42,0.94))]',
    gold: 'border-[rgba(255,195,99,0.48)] bg-[linear-gradient(155deg,rgba(58,35,24,0.95),rgba(29,14,18,0.95))]',
  } as const

  const paginate = (direction: number) => {
    setSlideDirection(direction)
    setPage((current) => current + direction)
  }

  const handleDotClick = (targetIndex: number) => {
    if (targetIndex === activeIndex) {
      return
    }

    const delta = targetIndex - activeIndex
    const loopDelta =
      Math.abs(delta) <= messages.length / 2
        ? delta
        : delta > 0
          ? delta - messages.length
          : delta + messages.length

    setSlideDirection(loopDelta > 0 ? 1 : -1)
    setPage((current) => current + loopDelta)
  }

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipePower = info.offset.x + info.velocity.x * 0.16

    if (swipePower <= -SWIPE_THRESHOLD) {
      paginate(1)
      return
    }
    if (swipePower >= SWIPE_THRESHOLD) {
      paginate(-1)
    }
  }

  const toggleReveal = (index: number) => {
    if (dragDistanceRef.current > 10) {
      return
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12)
    }

    setRevealed((state) =>
      state.map((value, stateIndex) => (stateIndex === index ? !value : value)),
    )
  }

  return (
    <SectionBlock
      id="messages"
      eyebrow={copy.messagesKicker}
      title={copy.messagesTitle}
      accent="neutral"
      className="pb-4"
    >
      <p className={`mb-2 text-[var(--ink-soft)] ${isArabic ? 'font-ar-body text-base' : 'text-sm'}`}>
        {copy.revealHint}
      </p>
      <p className={`mb-4 text-[var(--ink-muted)] ${isArabic ? 'font-ar-body text-sm' : 'text-xs tracking-[0.08em] uppercase'}`}>
        {copy.swipeHint}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: [0.2, 0.65, 0.3, 1] }}
        className="mx-auto max-w-[24rem] overflow-hidden"
      >
        <div className="[perspective:1200px]">
          <AnimatePresence custom={slideDirection} initial={false} mode="wait">
            <motion.button
              key={activeMessage.id}
              type="button"
              initial={{
                opacity: 0,
                x: slideDirection >= 0 ? 86 : -86,
                scale: 0.96,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: slideDirection >= 0 ? -86 : 86,
                scale: 0.97,
              }}
              transition={{ duration: 0.36, ease: [0.2, 0.65, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragStart={() => {
                dragDistanceRef.current = 0
              }}
              onDrag={(_event, info) => {
                dragDistanceRef.current = Math.max(
                  dragDistanceRef.current,
                  Math.abs(info.offset.x),
                )
              }}
              onDragEnd={handleDragEnd}
              onPointerDown={() => {
                dragDistanceRef.current = 0
              }}
              onClick={() => toggleReveal(activeIndex)}
              whileTap={{ scale: 0.988 }}
              className="h-[21rem] w-full rounded-[24px] text-left"
            >
              <motion.div
                animate={{ rotateY: revealed[activeIndex] ? 180 : 0 }}
                transition={{ duration: 0.58, ease: [0.2, 0.65, 0.3, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative h-full w-full"
              >
                <div
                  className={`backface-hidden absolute inset-0 rounded-[24px] border p-5 shadow-[0_18px_42px_rgba(0,0,0,0.3)] ${cardClassByAccent[activeAccent]}`}
                >
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <p className="mb-3 text-5xl drop-shadow-[0_0_14px_rgba(255,95,177,0.55)]">
                      {'\uD83E\uDDF8'}
                    </p>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--ink-main)]">
                      {activeMessage.coverLabel}
                    </p>
                    <p className={`text-[var(--ink-soft)] ${isArabic ? 'font-ar-body text-base leading-8' : 'text-sm leading-7'}`}>
                      {copy.revealHint}
                    </p>
                  </div>
                </div>

                <div
                  className={`backface-hidden rotate-y-180 absolute inset-0 rounded-[24px] border p-5 shadow-[0_18px_42px_rgba(0,0,0,0.3)] ${cardClassByAccent[activeAccent]}`}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rose-main)]">
                    {activeMessage.coverLabel}
                  </p>
                  <h3 className={`mb-4 text-2xl text-[var(--ink-main)] ${isArabic ? 'font-ar-display leading-[1.35]' : 'font-script text-4xl leading-[0.9]'}`}>
                    {activeMessage.title}
                  </h3>
                  <p className={`mb-4 text-[var(--ink-soft)] ${isArabic ? 'font-ar-body text-base leading-8' : 'text-base leading-7'}`}>
                    {activeMessage.body}
                  </p>
                  <p className="text-2xl">{activeMessage.emoji}</p>
                </div>
              </motion.div>
            </motion.button>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => paginate(-1)}
          className="h-9 rounded-full border border-white/20 px-4 text-xs text-[var(--ink-main)] transition hover:bg-white/10"
          aria-label={isArabic ? 'البطاقة السابقة' : 'Previous card'}
        >
          {isArabic ? 'السابق' : 'Prev'}
        </button>

        <div className="flex items-center gap-2">
          {messages.map((message, index) => (
            <button
              key={`${message.id}-dot`}
              type="button"
              onClick={() => handleDotClick(index)}
              className={`h-2.5 rounded-full transition ${
                activeIndex === index
                  ? 'w-7 bg-[var(--rose-main)]'
                  : 'w-2.5 bg-white/30'
              }`}
              aria-label={`Go to message ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-[var(--ink-muted)]">
            {activeIndex + 1}/{messages.length}
          </p>
          <button
            type="button"
            onClick={() => paginate(1)}
            className="h-9 rounded-full border border-white/20 px-4 text-xs text-[var(--ink-main)] transition hover:bg-white/10"
            aria-label={isArabic ? 'البطاقة التالية' : 'Next card'}
          >
            {isArabic ? 'التالي' : 'Next'}
          </button>
        </div>
      </div>
    </SectionBlock>
  )
}
