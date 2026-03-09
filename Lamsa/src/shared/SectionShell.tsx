import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { GlassCard } from './GlassCard'

type SectionShellProps = PropsWithChildren<{
  id: string
  eyebrow: string
  title: string
  className?: string
}>

export function SectionShell({
  id,
  eyebrow,
  title,
  className,
  children,
}: SectionShellProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1] }}
    >
      <GlassCard className={clsx(className)}>
        <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-[var(--rose-main)]">
          {eyebrow}
        </p>
        <h2 className="font-display mb-5 text-3xl leading-tight text-[var(--ink-main)] sm:text-[2.3rem]">
          {title}
        </h2>
        <div>{children}</div>
      </GlassCard>
    </motion.section>
  )
}
