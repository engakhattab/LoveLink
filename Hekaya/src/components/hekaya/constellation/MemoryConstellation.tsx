import { motion } from 'framer-motion'
import { useState } from 'react'
import type { ConstellationMemory, HekayaLocale } from '../../../types/hekaya'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'

interface MemoryConstellationProps {
  title: string
  subtitle: string
  memories: ConstellationMemory[]
  locale: HekayaLocale
  onComplete?: () => void
}

export function MemoryConstellation({
  title,
  subtitle,
  memories,
  locale,
  onComplete,
}: MemoryConstellationProps) {
  const [selectedMemory, setSelectedMemory] = useState<ConstellationMemory | null>(null)

  const copy =
    locale === 'ar'
      ? {
          complete: 'إنهاء الاستكشاف',
        }
      : {
          complete: 'Finish Exploration',
        }

  return (
    <GlassCard tone="elevated" className="space-y-4">
      <div className="text-center">
        <h2 className="hekaya-font-display text-2xl text-[var(--hekaya-text-primary)]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--hekaya-text-secondary)]">{subtitle}</p>
      </div>

      <div className="relative h-[20rem] overflow-hidden rounded-3xl border border-[rgba(167,139,250,0.24)] bg-[rgba(12,6,25,0.68)]">
        {memories.map((memory) => (
          <motion.button
            key={memory.id}
            type="button"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${memory.x}%`, top: `${memory.y}%` }}
            aria-label={memory.caption}
            onClick={() => setSelectedMemory(memory)}
          >
            <span className="block h-3 w-3 rounded-full bg-[var(--hekaya-star-bright)] shadow-[0_0_18px_rgba(251,191,36,0.65)]" />
          </motion.button>
        ))}
      </div>

      {selectedMemory ? (
        <GlassCard className="space-y-2">
          <p className="text-sm text-[var(--hekaya-text-secondary)]">{selectedMemory.caption}</p>
          <img
            src={selectedMemory.photo}
            alt={selectedMemory.caption}
            className="h-56 w-full rounded-2xl object-cover"
          />
        </GlassCard>
      ) : null}

      {onComplete ? (
        <NeonButton wide={false} onClick={onComplete}>
          {copy.complete}
        </NeonButton>
      ) : null}
    </GlassCard>
  )
}
