import { SectionShell } from '../../../shared/SectionShell'
import type { LamsaCopy } from '../copy'

interface MessageSectionProps {
  message: string
  copy: LamsaCopy
}

export function MessageSection({ message, copy }: MessageSectionProps) {
  return (
    <SectionShell id="message" eyebrow={copy.messageEyebrow} title={copy.messageTitle}>
      <p className="mb-4 text-[0.96rem] leading-7 text-[var(--ink-soft)]">
        {copy.messageIntro}
      </p>
      <blockquote className="rounded-2xl border border-[rgba(183,127,131,0.28)] bg-white/62 px-4 py-5 text-[1rem] leading-8 text-[var(--ink-main)] sm:px-5 sm:text-[1.05rem]">
        {message}
      </blockquote>
    </SectionShell>
  )
}
