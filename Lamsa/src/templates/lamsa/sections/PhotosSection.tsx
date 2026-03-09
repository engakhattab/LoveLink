import { motion } from 'framer-motion'
import { SectionShell } from '../../../shared/SectionShell'
import type { GiftPhotoSet } from '../../../types/gift'
import type { LamsaCopy } from '../copy'

interface PhotosSectionProps {
  photos: GiftPhotoSet
  copy: LamsaCopy
}

export function PhotosSection({ photos, copy }: PhotosSectionProps) {
  return (
    <SectionShell
      id="photos"
      eyebrow={copy.photosEyebrow}
      title={copy.photosTitle}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {photos.map((photo, index) => (
          <motion.figure
            key={photo}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            className="group relative overflow-hidden rounded-2xl border border-white/58 bg-white/60 shadow-[0_14px_38px_rgba(87,53,53,0.08)]"
          >
            <img
              src={photo}
              alt={`${copy.photoAltPrefix} ${index + 1}`}
              loading="lazy"
              className="h-[10.25rem] w-full object-cover transition duration-500 group-hover:scale-[1.035] sm:h-[13rem]"
            />
          </motion.figure>
        ))}
      </div>
      <p className="mt-4 text-[0.96rem] leading-7 text-[var(--ink-soft)]">
        {copy.photosCaption}
      </p>
    </SectionShell>
  )
}
