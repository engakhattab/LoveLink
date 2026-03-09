import { SectionShell } from '../../../shared/SectionShell'
import type { LamsaCopy } from '../copy'

interface ClosingSectionProps {
  senderName: string
  copy: LamsaCopy
}

export function ClosingSection({ senderName, copy }: ClosingSectionProps) {
  return (
    <SectionShell id="closing" eyebrow={copy.closingEyebrow} title={copy.closingTitle}>
      <p className="text-[1rem] leading-8 text-[var(--ink-main)]">{copy.closingText}</p>
      <div className="my-5 soft-divider" />
      <p className="font-display text-[1.65rem] text-[var(--ink-main)]">
        {copy.signaturePrefix} {senderName}
      </p>
    </SectionShell>
  )
}
