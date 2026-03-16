import { clsx } from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'

interface StarPoint {
  x: number
  y: number
  size: number
  delay: number
  duration: number
  opacity: number
  color: string
}

interface StarFieldProps {
  className?: string
  count?: number
  animated?: boolean
}

function buildStarMap(total: number): StarPoint[] {
  return Array.from({ length: total }, (_, index) => {
    const x = (index * 37 + 17) % 100
    const y = (index * 29 + 11) % 100
    const size = 2 + (index % 4) * 1.2
    const delay = (index % 10) * 0.45
    const duration = 3.6 + (index % 6) * 0.7
    const opacity = 0.42 + (index % 5) * 0.12
    const color =
      index % 3 === 0 ? 'var(--hekaya-star-bright)' : 'var(--hekaya-star-dim)'

    return { x, y, size, delay, duration, opacity, color }
  })
}

const STAR_MAP = buildStarMap(128)

export function StarField({
  className,
  count = 96,
  animated = true,
}: StarFieldProps) {
  const reducedMotion = useReducedMotion()
  const shouldAnimate = animated && !reducedMotion
  const stars =
    count <= STAR_MAP.length
      ? STAR_MAP.slice(0, count)
      : Array.from({ length: count }, (_, index) => STAR_MAP[index % STAR_MAP.length])

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-0 overflow-hidden',
        'hekaya-starfield-vignette',
        className,
      )}
    >
      {stars.map((star, index) => (
        <motion.span
          key={`${star.x}-${star.y}-${index}`}
          className="absolute block rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            backgroundColor: star.color,
            boxShadow:
              star.color === 'var(--hekaya-star-bright)'
                ? '0 0 14px rgba(254,243,199,0.85)'
                : '0 0 12px rgba(167,139,250,0.75)',
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.45],
                  scale: [1, 1.55, 1],
                }
              : undefined
          }
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
