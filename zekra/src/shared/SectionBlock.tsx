import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { GlassPanel } from './GlassPanel'

type SectionBlockProps = PropsWithChildren<{
  id: string
  eyebrow: string
  title: string
  accent?: 'neutral' | 'rose' | 'gold'
  className?: string
}>

export function SectionBlock({
  id,
  eyebrow,
  title,
  accent = 'neutral',
  className,
  children,
}: SectionBlockProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.58, ease: [0.2, 0.65, 0.3, 1] }}
    >
      <GlassPanel accent={accent} className={clsx('overflow-hidden', className)}>
        <p className="mb-1 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--rose-main)]">
          <span className="me-1.5 text-[var(--gold-accent)]">•</span>
          {eyebrow}
        </p>
        <h2 className="mb-5 text-[1.68rem] leading-tight text-[var(--ink-main)] sm:text-[2rem]">
          {title}
        </h2>
        {children}
      </GlassPanel>
    </motion.section>
  )
}
