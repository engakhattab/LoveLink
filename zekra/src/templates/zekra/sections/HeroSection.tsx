import { motion } from 'framer-motion'
import { SectionBlock } from '../../../shared/SectionBlock'
import type { ZekraLocale } from '../../../types/zekra'
import type { ZekraCopy } from '../copy'

interface HeroSectionProps {
  receiverName: string
  senderName: string
  introLine: string
  locale: ZekraLocale
  copy: ZekraCopy
}

export function HeroSection({
  receiverName,
  senderName,
  introLine,
  locale,
  copy,
}: HeroSectionProps) {
  const isArabic = locale === 'ar'

  return (
    <SectionBlock
      id="hero"
      eyebrow={copy.heroKicker}
      title={copy.heroTitle}
      accent="rose"
      className="relative"
    >
      <span className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-[rgba(255,87,170,0.24)] blur-3xl" />
      <p className={`mb-5 text-[var(--ink-soft)] ${isArabic ? 'font-ar-body text-[1.06rem] leading-8' : 'text-[1rem] leading-7'}`}>
        {copy.heroSubline}
      </p>
      <div className="rounded-3xl border border-[rgba(255,190,85,0.25)] bg-[rgba(255,255,255,0.05)] px-4 py-4 sm:px-5">
        <p
          className={`mb-4 text-center ${isArabic ? 'font-ar-thuluth text-[3.35rem] leading-[1.16]' : 'font-script text-6xl leading-[0.95]'}`}
        >
          {receiverName}
          <span className="mx-2 text-[var(--rose-main)]">❤</span>
          {senderName}
        </p>
        <div className="heart-divider mb-4" />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={`text-center text-[var(--ink-soft)] ${isArabic ? 'font-ar-body text-lg leading-8' : 'text-[1.02rem] leading-7'}`}
        >
          {introLine}
        </motion.p>
      </div>
    </SectionBlock>
  )
}
