import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { ChapterPhoto } from '../../../types/hekaya'

interface PhotoCardProps {
  photo: ChapterPhoto
  index: number
}

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  emoji: string
  scale: number
  duration: number
}

const EMOJIS = ['❤', '💖', '💕', '✨', '🌸', '🌹', '💐', '⭐', '💫']

function createParticles(clickX: number, clickY: number, rect: DOMRect): Particle[] {
  const relativeX = ((clickX - rect.left) / rect.width) * 100
  const relativeY = ((clickY - rect.top) / rect.height) * 100

  return Array.from({ length: 12 }, (_, index) => ({
    id: Date.now() + index,
    x: relativeX,
    y: relativeY,
    angle: (360 / 12) * index,
    distance: 60 + (index % 3) * 25,
    emoji: EMOJIS[index % EMOJIS.length]!,
    scale: 0.8 + (index % 3) * 0.3,
    duration: 0.8 + (index % 4) * 0.2,
  }))
}

export function PhotoCard({ photo, index }: PhotoCardProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const newParticles = createParticles(event.clientX, event.clientY, rect)
    setParticles((prev) => [...prev, ...newParticles])

    setTimeout(() => {
      setParticles((prev) => prev.slice(newParticles.length))
    }, 1200)
  }

  return (
    <motion.figure
      key={`${photo.src}-${index}`}
      className="relative overflow-hidden rounded-2xl border border-[rgba(167,139,250,0.25)] bg-[rgba(20,10,35,0.4)] cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <figcaption className="px-3 py-2 text-sm text-[var(--hekaya-text-secondary)]">
        {photo.caption ?? photo.alt}
      </figcaption>

      <AnimatePresence>
        {particles.map((particle) => {
          const radians = (particle.angle * Math.PI) / 180
          const x = Math.cos(radians) * particle.distance
          const y = Math.sin(radians) * particle.distance

          return (
            <motion.span
              key={particle.id}
              className="pointer-events-none absolute text-2xl"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, x],
                y: [0, y],
                scale: [0.3, particle.scale, 0.5],
                rotate: [0, (particle.angle % 2 === 0 ? 1 : -1) * 180],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: particle.duration,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {particle.emoji}
            </motion.span>
          )
        })}
      </AnimatePresence>
    </motion.figure>
  )
}
