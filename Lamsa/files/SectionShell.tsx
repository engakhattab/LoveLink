import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { GlassCard } from './GlassCard'

type SectionShellProps = PropsWithChildren<{
  id: string
  eyebrow: string
  title: string
  className?: string
  accent?: boolean
}>

export function SectionShell({
  id,
  eyebrow,
  title,
  className,
  accent,
  children,
}: SectionShellProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.62, ease: [0.2, 0.65, 0.3, 1] }}
    >
      <GlassCard accent={accent} className={clsx(className)}>
        {/* eyebrow with rose bullet */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--rose-main)' }}
          />
          <p
            className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: 'var(--rose-main)' }}
          >
            {eyebrow}
          </p>
        </div>

        <h2
          className="font-display mb-5 text-3xl leading-tight sm:text-[2.3rem]"
          style={{ color: 'var(--ink-main)' }}
        >
          {title}
        </h2>

        <div>{children}</div>
      </GlassCard>
    </motion.section>
  )
}
