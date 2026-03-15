import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SectionBlock } from '../../../shared/SectionBlock'
import type { ZekraCopy } from '../copy'
import type { ZekraLocale, ZekraPhoto } from '../../../types/zekra'

interface PhotoMemoriesProps {
  photos: ZekraPhoto[]
  locale: ZekraLocale
  copy: ZekraCopy
}

const BURST_POINTS = [
  { x: -34, y: -24 },
  { x: 0, y: -32 },
  { x: 30, y: -22 },
  { x: -26, y: 10 },
  { x: 28, y: 8 },
  { x: -8, y: 28 },
  { x: 14, y: 26 },
]

const BURST_EMOJI = ['💖', '💕', '💗', '✨', '💞', '❤', '🌟']

export function PhotoMemories({ photos, locale, copy }: PhotoMemoriesProps) {
  const isArabic = locale === 'ar'

  return (
    <SectionBlock
      id="photos"
      eyebrow={copy.photosKicker}
      title={copy.photosTitle}
      accent="neutral"
    >
      <div className="grid grid-cols-1 gap-4">
        {photos.map((photo, index) => (
          <PhotoCard
            key={`${photo.src}-${index}`}
            index={index}
            photo={photo}
            locale={locale}
            copy={copy}
          />
        ))}
      </div>
      <p className={`mt-4 text-[var(--ink-muted)] ${isArabic ? 'font-ar-body text-sm' : 'text-xs tracking-[0.08em] uppercase'}`}>
        {copy.swipeHint}
      </p>
    </SectionBlock>
  )
}

interface PhotoCardProps {
  index: number
  photo: ZekraPhoto
  locale: ZekraLocale
  copy: ZekraCopy
}

function PhotoCard({ index, photo, locale, copy }: PhotoCardProps) {
  const isArabic = locale === 'ar'
  const [burstKey, setBurstKey] = useState(0)
  const [showBurst, setShowBurst] = useState(false)

  const triggerBurst = () => {
    setBurstKey((value) => value + 1)
    setShowBurst(true)
  }

  useEffect(() => {
    if (!showBurst) {
      return
    }
    const timer = window.setTimeout(() => setShowBurst(false), 900)
    return () => window.clearTimeout(timer)
  }, [showBurst])

  return (
    <motion.figure
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] shadow-[0_16px_34px_rgba(7,1,14,0.48)]"
      onMouseEnter={triggerBurst}
      onClick={triggerBurst}
      onTouchStart={triggerBurst}
    >
      <img
        src={photo.src}
        alt={`${copy.photoAltPrefix} ${index + 1}`}
        loading="lazy"
        className="h-[15.5rem] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[20rem]"
      />
      <figcaption
        className={`min-h-[3.1rem] border-t border-white/12 bg-[rgba(12,3,18,0.74)] px-2.5 py-2 text-sm text-[var(--ink-soft)] ${isArabic ? 'font-ar-body text-sm leading-6' : 'leading-5'}`}
      >
        {photo.caption}
      </figcaption>

      {showBurst
        ? BURST_POINTS.map((point, particleIndex) => (
            <motion.span
              key={`${burstKey}-${particleIndex}`}
              initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: point.x,
                y: point.y,
                scale: [0.5, 1.08, 0.75],
              }}
              transition={{
                duration: 0.75,
                delay: particleIndex * 0.03,
                ease: 'easeOut',
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 text-sm drop-shadow-[0_0_10px_rgba(255,93,172,0.58)]"
            >
              {BURST_EMOJI[particleIndex]}
            </motion.span>
          ))
        : null}
    </motion.figure>
  )
}
