import { motion, useReducedMotion } from 'framer-motion'

/* Mix of rose petals and gold flecks */
const PARTICLES = [
  { left: '2%',  size: 10, duration: 20, delay: 0,  opacity: 0.62, type: 'rose' },
  { left: '7%',  size: 13, duration: 24, delay: 2.5, opacity: 0.55, type: 'gold' },
  { left: '12%', size: 9,  duration: 19, delay: 5,  opacity: 0.58, type: 'rose' },
  { left: '18%', size: 15, duration: 27, delay: 1,  opacity: 0.52, type: 'ivory' },
  { left: '24%', size: 10, duration: 21, delay: 7,  opacity: 0.6,  type: 'rose' },
  { left: '30%', size: 13, duration: 25, delay: 3.5, opacity: 0.56, type: 'gold' },
  { left: '36%', size: 11, duration: 20, delay: 4,  opacity: 0.54, type: 'rose' },
  { left: '42%', size: 16, duration: 28, delay: 2,  opacity: 0.5,  type: 'rose' },
  { left: '48%', size: 9,  duration: 19, delay: 6,  opacity: 0.58, type: 'gold' },
  { left: '54%', size: 13, duration: 26, delay: 1.5, opacity: 0.55, type: 'rose' },
  { left: '60%', size: 10, duration: 22, delay: 8,  opacity: 0.6,  type: 'ivory' },
  { left: '66%', size: 14, duration: 25, delay: 3,  opacity: 0.53, type: 'gold' },
  { left: '72%', size: 11, duration: 21, delay: 5.5, opacity: 0.57, type: 'rose' },
  { left: '78%', size: 15, duration: 28, delay: 2,  opacity: 0.5,  type: 'rose' },
  { left: '83%', size: 10, duration: 22, delay: 7.5, opacity: 0.56, type: 'gold' },
  { left: '88%', size: 12, duration: 24, delay: 4.5, opacity: 0.54, type: 'rose' },
  { left: '93%', size: 9,  duration: 19, delay: 6.5, opacity: 0.58, type: 'ivory' },
  { left: '97%', size: 13, duration: 23, delay: 1,  opacity: 0.52, type: 'rose' },
]

const PARTICLE_COLOR = {
  rose:  'var(--particle-rose)',
  gold:  'var(--particle-gold)',
  ivory: 'var(--particle-ivory)',
}

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
          className="absolute block"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size * 1.6,
            borderRadius:
              index % 3 === 0 ? '72% 28% 60% 40% / 44% 56% 44% 56%'
              : index % 3 === 1 ? '44% 56% 36% 64% / 60% 40% 60% 40%'
              : '60% 40% 50% 50% / 36% 64% 36% 64%',
            top: '-18%',
            background: PARTICLE_COLOR[particle.type as keyof typeof PARTICLE_COLOR],
            filter: `blur(${particle.type === 'gold' ? '0.4px' : '0.7px'})`,
            opacity: particle.opacity,
          }}
          initial={reducedMotion ? undefined : { y: '-10vh' }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: ['0vh', '128vh'],
                  x: [0, 12, -9, 4, 0],
                  rotate: [-18, 12, -6, 8, 0],
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
