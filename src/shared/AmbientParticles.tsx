import { motion, useReducedMotion } from 'framer-motion'

const PARTICLES = [
  { left: '5%', size: 10, duration: 18, delay: 0, opacity: 0.42 },
  { left: '12%', size: 8, duration: 20, delay: 4, opacity: 0.34 },
  { left: '18%', size: 13, duration: 24, delay: 2, opacity: 0.4 },
  { left: '25%', size: 9, duration: 19, delay: 7, opacity: 0.37 },
  { left: '33%', size: 11, duration: 22, delay: 1, opacity: 0.35 },
  { left: '41%', size: 8, duration: 17, delay: 5, opacity: 0.36 },
  { left: '49%', size: 14, duration: 25, delay: 3, opacity: 0.34 },
  { left: '57%', size: 9, duration: 21, delay: 8, opacity: 0.39 },
  { left: '64%', size: 12, duration: 23, delay: 6, opacity: 0.35 },
  { left: '72%', size: 10, duration: 20, delay: 2, opacity: 0.38 },
  { left: '80%', size: 13, duration: 24, delay: 4, opacity: 0.34 },
  { left: '88%', size: 9, duration: 19, delay: 1, opacity: 0.4 },
  { left: '94%', size: 11, duration: 22, delay: 6, opacity: 0.33 },
]

export function AmbientParticles() {
  const reducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={`particle-${index}`}
          className="absolute block rounded-full blur-[0.6px]"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size * 1.35,
            top: '-18%',
            background:
              index % 3 === 0 ? 'var(--particle-ivory)' : 'var(--particle-rose)',
            opacity: particle.opacity,
          }}
          initial={reducedMotion ? undefined : { y: '-10vh' }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: ['0vh', '124vh'],
                  x: [0, 8, -6, 0],
                  rotate: [-9, 7, -3, 0],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
