import { motion, useReducedMotion } from 'framer-motion'

const PARTICLES = [
  { left: '3%', size: 9, duration: 19, delay: 0, opacity: 0.44 },
  { left: '8%', size: 11, duration: 21, delay: 2, opacity: 0.39 },
  { left: '13%', size: 8, duration: 18, delay: 5, opacity: 0.36 },
  { left: '19%', size: 13, duration: 25, delay: 1, opacity: 0.41 },
  { left: '25%', size: 9, duration: 20, delay: 7, opacity: 0.38 },
  { left: '31%', size: 12, duration: 23, delay: 3, opacity: 0.4 },
  { left: '37%', size: 10, duration: 19, delay: 4, opacity: 0.35 },
  { left: '43%', size: 14, duration: 26, delay: 2, opacity: 0.39 },
  { left: '49%', size: 8, duration: 18, delay: 6, opacity: 0.36 },
  { left: '55%', size: 12, duration: 24, delay: 1, opacity: 0.41 },
  { left: '61%', size: 9, duration: 20, delay: 8, opacity: 0.37 },
  { left: '67%', size: 13, duration: 25, delay: 3, opacity: 0.38 },
  { left: '73%', size: 10, duration: 21, delay: 5, opacity: 0.4 },
  { left: '79%', size: 14, duration: 27, delay: 2, opacity: 0.36 },
  { left: '84%', size: 9, duration: 20, delay: 7, opacity: 0.4 },
  { left: '89%', size: 11, duration: 23, delay: 4, opacity: 0.37 },
  { left: '94%', size: 8, duration: 18, delay: 6, opacity: 0.35 },
  { left: '97%', size: 12, duration: 24, delay: 1, opacity: 0.39 },
]

export function AmbientParticles() {
  const reducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={`particle-${index}`}
          className="absolute block blur-[0.6px]"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size * 1.55,
            borderRadius:
              index % 2 === 0 ? '68% 32% 64% 36%' : '42% 58% 34% 66%',
            top: '-24%',
            background:
              index % 3 === 0 ? 'var(--particle-ivory)' : 'var(--particle-rose)',
            opacity: particle.opacity,
          }}
          initial={reducedMotion ? undefined : { y: '-12vh' }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: ['0vh', '132vh'],
                  x: [0, 10, -8, 0],
                  rotate: [-14, 11, -5, 0],
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
