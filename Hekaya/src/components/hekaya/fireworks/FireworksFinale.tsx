import { motion } from 'framer-motion'
import { useEffect } from 'react'
import type { FireworksConfig, HekayaLocale } from '../../../types/hekaya'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'

interface FireworksFinaleProps {
  config: FireworksConfig
  locale: HekayaLocale
  onComplete?: () => void
}

export function FireworksFinale({
  config,
  locale,
  onComplete,
}: FireworksFinaleProps) {
  useEffect(() => {
    if (!onComplete) return
    if (!config.autoTrigger) return

    const timeout = window.setTimeout(() => {
      onComplete()
    }, config.duration)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [config.autoTrigger, config.duration, onComplete])

  const copy =
    locale === 'ar'
      ? {
          finish: 'اكتمال الاحتفال',
        }
      : {
          finish: 'Finish Celebration',
        }

  return (
    <GlassCard tone="elevated" className="space-y-5 text-center">
      <h2 className="hekaya-font-display text-2xl text-[var(--hekaya-text-primary)]">
        {config.title}
      </h2>

      <div className="grid gap-2 text-sm text-[var(--hekaya-text-secondary)]">
        {config.floatingMessages.slice(0, 6).map((message, index) => (
          <motion.p
            key={`${index}-${message}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            {message}
          </motion.p>
        ))}
      </div>

      {onComplete ? (
        <NeonButton wide={false} onClick={onComplete}>
          {copy.finish}
        </NeonButton>
      ) : null}
    </GlassCard>
  )
}
