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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07, duration: 0.46 }}
            className="group relative overflow-hidden rounded-2xl"
            style={{
              border: '1.5px solid rgba(255, 255, 255, 0.65)',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 10px 32px rgba(194, 37, 74, 0.08)',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            }}
            whileHover={{
              y: -3,
              boxShadow: '0 20px 48px rgba(194, 37, 74, 0.2)',
            }}
          >
            {/* rose tint overlay on hover */}
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(180deg, transparent 55%, rgba(232, 71, 106, 0.14) 100%)',
              }}
            />
            <img
              src={photo}
              alt={`${copy.photoAltPrefix} ${index + 1}`}
              loading="lazy"
              className="h-[10.25rem] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[13rem]"
            />
          </motion.figure>
        ))}
      </div>

      <p className="mt-4 text-[0.96rem] leading-7" style={{ color: 'var(--ink-soft)' }}>
        {copy.photosCaption}
      </p>
    </SectionShell>
  )
}
