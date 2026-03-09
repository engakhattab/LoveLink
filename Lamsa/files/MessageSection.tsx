import { SectionShell } from '../../../shared/SectionShell'
import type { LamsaCopy } from '../copy'

interface MessageSectionProps {
  message: string
  copy: LamsaCopy
}

export function MessageSection({ message, copy }: MessageSectionProps) {
  return (
    <SectionShell
      id="message"
      eyebrow={copy.messageEyebrow}
      title={copy.messageTitle}
      accent
    >
      <p
        className="mb-4 text-[0.96rem] leading-7"
        style={{ color: 'var(--ink-soft)' }}
      >
        {copy.messageIntro}
      </p>

      {/* Blockquote — rose left-border with warm glass surface */}
      <blockquote
        className="relative rounded-2xl px-5 py-5 text-[1rem] leading-8 sm:px-6 sm:text-[1.05rem]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.78), rgba(255,214,227,0.38))',
          border: '1px solid rgba(232, 71, 106, 0.22)',
          borderLeft: '3.5px solid var(--rose-main)',
          color: 'var(--ink-main)',
        }}
      >
        {/* Decorative quote mark */}
        <span
          className="font-display pointer-events-none absolute -top-3 left-4 text-5xl leading-none"
          style={{ color: 'rgba(232, 71, 106, 0.25)' }}
          aria-hidden="true"
        >
          ❝
        </span>
        {message}
      </blockquote>
    </SectionShell>
  )
}
