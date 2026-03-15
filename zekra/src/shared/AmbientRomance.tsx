import { motion, useReducedMotion } from 'framer-motion'

type AmbientMode = 'default' | 'lock'

interface AmbientParticle {
  left: string
  glyph: string
  size: number
  delay: number
  duration: number
  color: string
  opacity: number
}

interface AmbientRomanceProps {
  mode?: AmbientMode
  reducedParticles?: boolean
}

const DEFAULT_PARTICLES: AmbientParticle[] = [
  { left: '4%', glyph: '\u2665', size: 10, delay: 0, duration: 17, color: 'var(--particle-rose)', opacity: 0.62 },
  { left: '10%', glyph: '\u2022', size: 11, delay: 3, duration: 21, color: 'var(--particle-soft)', opacity: 0.58 },
  { left: '17%', glyph: '\u2726', size: 12, delay: 6, duration: 18, color: 'var(--particle-gold)', opacity: 0.64 },
  { left: '23%', glyph: '\u2665', size: 9, delay: 4, duration: 22, color: 'var(--particle-rose)', opacity: 0.6 },
  { left: '29%', glyph: '\u2022', size: 10, delay: 8, duration: 19, color: 'var(--particle-soft)', opacity: 0.56 },
  { left: '35%', glyph: '\u2726', size: 11, delay: 5, duration: 24, color: 'var(--particle-gold)', opacity: 0.62 },
  { left: '41%', glyph: '\u2665', size: 10, delay: 2, duration: 20, color: 'var(--particle-rose)', opacity: 0.61 },
  { left: '47%', glyph: '\u2022', size: 12, delay: 9, duration: 18, color: 'var(--particle-soft)', opacity: 0.58 },
  { left: '53%', glyph: '\u2726', size: 11, delay: 1, duration: 23, color: 'var(--particle-gold)', opacity: 0.63 },
  { left: '59%', glyph: '\u2665', size: 10, delay: 7, duration: 19, color: 'var(--particle-rose)', opacity: 0.61 },
  { left: '65%', glyph: '\u2022', size: 10, delay: 3, duration: 21, color: 'var(--particle-soft)', opacity: 0.56 },
  { left: '71%', glyph: '\u2726', size: 12, delay: 8, duration: 25, color: 'var(--particle-gold)', opacity: 0.63 },
  { left: '77%', glyph: '\u2665', size: 9, delay: 0, duration: 18, color: 'var(--particle-rose)', opacity: 0.6 },
  { left: '82%', glyph: '\u2022', size: 11, delay: 6, duration: 22, color: 'var(--particle-soft)', opacity: 0.57 },
  { left: '88%', glyph: '\u2726', size: 12, delay: 4, duration: 20, color: 'var(--particle-gold)', opacity: 0.64 },
  { left: '93%', glyph: '\u2665', size: 10, delay: 2, duration: 24, color: 'var(--particle-rose)', opacity: 0.61 },
]

const LOCK_PARTICLES: AmbientParticle[] = [
  { left: '2%', glyph: '\u2665', size: 12, delay: 0, duration: 15, color: 'var(--particle-rose)', opacity: 0.78 },
  { left: '10%', glyph: '\u2665', size: 14, delay: 1, duration: 16, color: 'var(--particle-rose)', opacity: 0.8 },
  { left: '19%', glyph: '\u2726', size: 12, delay: 3, duration: 17, color: 'var(--particle-gold)', opacity: 0.76 },
  { left: '23%', glyph: '\u2665', size: 13, delay: 7, duration: 15, color: 'var(--particle-rose)', opacity: 0.79 },
  { left: '31%', glyph: '\u2726', size: 12, delay: 4, duration: 18, color: 'var(--particle-gold)', opacity: 0.74 },
  { left: '35%', glyph: '\u2665', size: 12, delay: 1, duration: 14, color: 'var(--particle-rose)', opacity: 0.78 },
  { left: '43%', glyph: '\u2726', size: 13, delay: 5, duration: 15, color: 'var(--particle-gold)', opacity: 0.76 },
  { left: '51%', glyph: '\u2665', size: 14, delay: 2, duration: 17, color: 'var(--particle-rose)', opacity: 0.8 },
  { left: '55%', glyph: '\u2726', size: 12, delay: 8, duration: 14, color: 'var(--particle-gold)', opacity: 0.74 },
  { left: '59%', glyph: '\u2665', size: 12, delay: 3, duration: 16, color: 'var(--particle-rose)', opacity: 0.79 },
  { left: '67%', glyph: '\u2726', size: 13, delay: 4, duration: 18, color: 'var(--particle-gold)', opacity: 0.75 },
  { left: '71%', glyph: '\u2665', size: 12, delay: 1, duration: 14, color: 'var(--particle-rose)', opacity: 0.78 },
  { left: '79%', glyph: '\u2726', size: 12, delay: 2, duration: 17, color: 'var(--particle-gold)', opacity: 0.74 },
  { left: '83%', glyph: '\u2665', size: 13, delay: 9, duration: 16, color: 'var(--particle-rose)', opacity: 0.79 },
  { left: '91%', glyph: '\u2726', size: 11, delay: 3, duration: 15, color: 'var(--particle-gold)', opacity: 0.73 },
  { left: '95%', glyph: '\u2665', size: 12, delay: 0, duration: 17, color: 'var(--particle-rose)', opacity: 0.78 },
]

export function AmbientRomance({
  mode = 'default',
  reducedParticles = false,
}: AmbientRomanceProps) {
  const reducedMotion = useReducedMotion()
  const baseParticles = mode === 'lock' ? LOCK_PARTICLES : DEFAULT_PARTICLES
  const particles = reducedParticles
    ? baseParticles.filter((_, index) => index % 3 !== 2)
    : baseParticles

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${index}-${mode}`}
          className="absolute block"
          style={{
            left: particle.left,
            top: '-20%',
            color: particle.color,
            fontSize: particle.size,
            opacity: particle.opacity,
            textShadow:
              mode === 'lock'
                ? '0 0 16px rgba(255, 90, 166, 0.42)'
                : '0 0 14px rgba(255, 90, 166, 0.35)',
          }}
          initial={reducedMotion ? undefined : { y: '-8vh' }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: ['0vh', '130vh'],
                  x: mode === 'lock' ? [0, 14, -10, 4, 0] : [0, 10, -6, 0],
                  rotate: mode === 'lock' ? [-12, 12, -6, 0] : [-10, 9, -4, 0],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {particle.glyph}
        </motion.span>
      ))}
    </div>
  )
}
