import { motion } from 'framer-motion'
import { useId, useState } from 'react'
import type { ConstellationMemory, HekayaLocale } from '../../../types/hekaya'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'

interface MemoryConstellationProps {
  title: string
  subtitle: string
  memories: ConstellationMemory[]
  locale: HekayaLocale
  onClose?: () => void
  onComplete?: () => void
}

function getStarSize(size: ConstellationMemory['size']) {
  if (size === 'small') return 'h-2.5 w-2.5'
  if (size === 'large') return 'h-4 w-4'
  return 'h-3 w-3'
}

function getStarGlow(brightness: ConstellationMemory['brightness']) {
  if (brightness === 'dim') return 'shadow-[0_0_10px_rgba(251,191,36,0.4)]'
  if (brightness === 'bright') return 'shadow-[0_0_24px_rgba(251,191,36,0.75)]'
  return 'shadow-[0_0_16px_rgba(251,191,36,0.6)]'
}

export function MemoryConstellation({
  title,
  subtitle,
  memories,
  locale,
  onClose,
  onComplete,
}: MemoryConstellationProps) {
  const [selectedMemory, setSelectedMemory] = useState<ConstellationMemory | null>(
    memories[0] ?? null,
  )
  const titleId = useId()

  const copy =
    locale === 'ar'
      ? {
          close: 'الرجوع للفهرس',
          complete: 'إنهاء الاستكشاف',
          pickHint: 'اختاري نجمة علشان تظهَر الذكرى',
        }
      : {
          close: 'Back to Hub',
          complete: 'Finish Exploration',
          pickHint: 'Select a star to view the memory',
        }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8"
      style={{
        background:
          'radial-gradient(circle at 15% 10%, rgba(167,139,250,0.2), transparent 45%), radial-gradient(circle at 85% 5%, rgba(251,191,36,0.13), transparent 45%), linear-gradient(180deg, #16042b 0%, #0a0118 100%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-4xl">
        <GlassCard tone="elevated" className="space-y-5 py-8 sm:py-10">
          <div className="space-y-2 text-center">
            <h2
              id={titleId}
              className="hekaya-font-display text-2xl text-[var(--hekaya-text-primary)] sm:text-3xl"
            >
              {title}
            </h2>
            <p className="text-sm text-[var(--hekaya-text-secondary)]">{subtitle}</p>
            <p className="text-xs text-[var(--hekaya-text-muted)]">{copy.pickHint}</p>
          </div>

          <div className="relative h-[19rem] overflow-hidden rounded-3xl border border-[rgba(167,139,250,0.24)] bg-[rgba(12,6,25,0.68)] sm:h-[22rem]">
            {memories.map((memory) => (
              <motion.button
                key={memory.id}
                type="button"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(251,191,36,0.65)]"
                style={{ left: `${memory.x}%`, top: `${memory.y}%` }}
                aria-label={memory.caption}
                aria-pressed={selectedMemory?.id === memory.id}
                onClick={() => setSelectedMemory(memory)}
              >
                <span
                  className={`block rounded-full bg-[var(--hekaya-star-bright)] transition ${getStarSize(memory.size)} ${getStarGlow(memory.brightness)} group-hover:scale-110`}
                />
              </motion.button>
            ))}
          </div>

          {selectedMemory ? (
            <GlassCard className="space-y-3">
              <p className="text-sm text-[var(--hekaya-text-secondary)]">
                {selectedMemory.caption}
              </p>
              <img
                src={selectedMemory.photo}
                alt={selectedMemory.caption}
                loading="lazy"
                decoding="async"
                className="h-56 w-full rounded-2xl object-cover sm:h-64"
              />
            </GlassCard>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onClose ? (
              <NeonButton variant="gold" wide={false} onClick={onClose}>
                {copy.close}
              </NeonButton>
            ) : null}
            {onComplete ? (
              <NeonButton wide={false} onClick={onComplete}>
                {copy.complete}
              </NeonButton>
            ) : null}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}
