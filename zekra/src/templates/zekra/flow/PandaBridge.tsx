import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GlassPanel } from '../../../shared/GlassPanel'
import type { ZekraCopy } from '../copy'

interface PandaBridgeProps {
  copy: ZekraCopy
  gifSrc?: string
  gifAlt?: string
  onComplete: () => void
}

export function PandaBridge({
  copy,
  gifSrc,
  gifAlt,
  onComplete,
}: PandaBridgeProps) {
  const [gifFailed, setGifFailed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3000)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42 }}
      className="mx-auto flex min-h-[72vh] max-w-[30rem] items-center pt-7"
    >
      <GlassPanel accent="rose" className="w-full text-center">
        <div className="mx-auto mb-5 flex min-h-[13rem] w-full max-w-[18.5rem] items-center justify-center overflow-hidden rounded-[24px] border border-[rgba(255,190,85,0.36)] bg-[rgba(255,255,255,0.07)]">
          {gifSrc && !gifFailed ? (
            <img
              src={gifSrc}
              alt={gifAlt || 'Pandas hugging'}
              className="h-full w-full object-cover"
              onError={() => setGifFailed(true)}
            />
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="mb-2 text-5xl">🐼💞🐼</p>
              <p className="text-sm text-[var(--ink-soft)]">{copy.loadingFallback}</p>
            </div>
          )}
        </div>

        <h2 className="font-script mb-1 text-5xl text-[var(--ink-main)]">
          {copy.loadingTitle}
        </h2>
        <p className="mb-4 text-sm text-[var(--ink-soft)]">{copy.loadingText}</p>
        <div className="mx-auto h-1.5 w-56 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--rose-main),var(--gold-accent))]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
          />
        </div>
      </GlassPanel>
    </motion.div>
  )
}
