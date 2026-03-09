import { SectionShell } from '../../../shared/SectionShell'
import type { LamsaCopy } from '../copy'

interface ClosingSectionProps {
  senderName: string
  copy: LamsaCopy
}

export function ClosingSection({ senderName, copy }: ClosingSectionProps) {
  return (
    <SectionShell id="closing" eyebrow={copy.closingEyebrow} title={copy.closingTitle}>
      <p
        className="text-[1rem] leading-8"
        style={{ color: 'var(--ink-main)' }}
      >
        {copy.closingText}
      </p>

      {/* Rose-gold heart divider */}
      <div className="heart-divider my-5">
        <span aria-hidden="true">♥</span>
      </div>

      {/* Signature card */}
      <div
        className="inline-block rounded-2xl px-5 py-3.5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(253,228,184,0.42))',
          border: '1px solid rgba(249, 164, 60, 0.25)',
        }}
      >
        <p
          className="font-display text-[1.7rem] leading-tight"
          style={{ color: 'var(--ink-main)' }}
        >
          {copy.signaturePrefix}{' '}
          <span style={{ color: 'var(--rose-main)' }}>{senderName}</span>
        </p>
      </div>
    </SectionShell>
  )
}
