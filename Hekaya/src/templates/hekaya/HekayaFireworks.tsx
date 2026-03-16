import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  defaultFireworksConfig,
  getOptimizedConfig,
  type FireworksConfig,
} from '../../content/fireworks.config'

type FireworksPhase = 'start' | 'playing' | 'complete'

type FireworksConfigOverrides = Partial<
  Omit<FireworksConfig, 'settings' | 'performance'>
> & {
  settings?: Partial<FireworksConfig['settings']>
  performance?: Partial<FireworksConfig['performance']>
}

interface HekayaFireworksProps {
  onComplete?: () => void
  config?: FireworksConfigOverrides
}

function mergeFireworksConfig(overrides?: FireworksConfigOverrides): FireworksConfig {
  const optimized = getOptimizedConfig()

  return {
    ...defaultFireworksConfig,
    ...optimized,
    ...overrides,
    images: overrides?.images ?? optimized.images,
    messages: overrides?.messages ?? optimized.messages,
    settings: {
      ...defaultFireworksConfig.settings,
      ...optimized.settings,
      ...overrides?.settings,
    },
    performance: {
      ...defaultFireworksConfig.performance,
      ...optimized.performance,
      ...overrides?.performance,
    },
  }
}

export function HekayaFireworks({ onComplete, config: customConfig }: HekayaFireworksProps) {
  const [runtimeConfig] = useState<FireworksConfig>(() =>
    mergeFireworksConfig(customConfig),
  )
  const [phase, setPhase] = useState<FireworksPhase>('start')
  const [timeLeft, setTimeLeft] = useState(runtimeConfig.settings.duration)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const engineRef = useRef<FireworksEngine | null>(null)
  const countdownRef = useRef<number | null>(null)
  const completeTimeoutRef = useRef<number | null>(null)
  const finishedRef = useRef(false)

  const teardownPlayback = () => {
    if (countdownRef.current !== null) {
      window.clearInterval(countdownRef.current)
      countdownRef.current = null
    }

    engineRef.current?.stop()
    engineRef.current = null

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }

  const handleComplete = () => {
    if (finishedRef.current) return
    finishedRef.current = true

    teardownPlayback()
    setTimeLeft(0)
    setPhase('complete')

    if (completeTimeoutRef.current !== null) {
      window.clearTimeout(completeTimeoutRef.current)
    }
    completeTimeoutRef.current = window.setTimeout(() => {
      onComplete?.()
    }, 950)
  }

  const handleStart = () => {
    if (phase !== 'start') return
    finishedRef.current = false
    setTimeLeft(runtimeConfig.settings.duration)
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'start') return
    if (!runtimeConfig.settings.autoStart) return
    finishedRef.current = false
    setTimeLeft(runtimeConfig.settings.duration)
    setPhase('playing')
  }, [phase, runtimeConfig.settings.autoStart, runtimeConfig.settings.duration])

  useEffect(() => {
    if (phase !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    const resizeCanvas = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth))
      canvas.height = Math.max(1, Math.floor(window.innerHeight))
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const engine = new FireworksEngine(context, canvas, runtimeConfig)
    engineRef.current = engine
    engine.start()

    if (runtimeConfig.settings.musicEnabled && runtimeConfig.settings.musicUrl) {
      const audio = new Audio(runtimeConfig.settings.musicUrl)
      audio.loop = true
      audio.volume = 0.6
      audioRef.current = audio
      void audio.play().catch(() => undefined)
    }

    countdownRef.current = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.setTimeout(() => {
            handleComplete()
          }, 0)
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      teardownPlayback()
    }
  }, [phase, runtimeConfig])

  useEffect(() => {
    return () => {
      teardownPlayback()
      if (completeTimeoutRef.current !== null) {
        window.clearTimeout(completeTimeoutRef.current)
      }
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {phase === 'start' ? (
        <StartScreen
          key="start"
          onStart={handleStart}
          recipientName={runtimeConfig.recipientName}
        />
      ) : null}

      {phase === 'playing' ? (
        <motion.div
          key="playing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black"
          dir="rtl"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <div className="absolute top-5 right-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-lg text-white/80 backdrop-blur-sm sm:text-xl">
            {timeLeft}s
          </div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleComplete}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/25 bg-black/35 px-6 py-3 text-sm text-white backdrop-blur-sm transition hover:bg-white/15 sm:text-base"
          >
            تخطي العرض
          </motion.button>
        </motion.div>
      ) : null}

      {phase === 'complete' ? (
        <motion.div
          key="complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-6 text-center"
          dir="rtl"
        >
          <div className="rounded-3xl border border-[rgba(217,70,239,0.45)] bg-[rgba(15,5,27,0.7)] px-8 py-7 shadow-[0_20px_50px_rgba(217,70,239,0.22)]">
            <p className="hekaya-font-display text-2xl text-[var(--hekaya-star-bright)] sm:text-3xl">
              العرض اكتمل
            </p>
            <p className="mt-2 text-sm text-[var(--hekaya-text-secondary)]">
              لحظة ونرجع للرحلة...
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

interface StartScreenProps {
  onStart: () => void
  recipientName: string
}

function StartScreen({ onStart, recipientName }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6"
      style={{
        background:
          'radial-gradient(circle at 18% 22%, rgba(251,191,36,0.14), transparent 45%), radial-gradient(circle at 78% 18%, rgba(217,70,239,0.2), transparent 42%), linear-gradient(180deg, #090414 0%, #140824 100%)',
      }}
      dir="rtl"
    >
      <div className="max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-3 text-sm tracking-[0.2em] text-[var(--hekaya-text-muted)] uppercase"
        >
          Hekaya Finale
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="hekaya-font-display text-4xl leading-tight text-[var(--hekaya-text-primary)] sm:text-6xl"
        >
          عرض الألعاب النارية
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="mx-auto mt-4 max-w-xl text-base leading-8 text-[var(--hekaya-text-secondary)] sm:text-xl"
        >
          يا {recipientName}، العرض ده معمول مخصوص عشان نختم الرحلة بلحظة كبيرة.
        </motion.p>

        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="mt-10 rounded-full bg-[linear-gradient(90deg,#d946ef,#a855f7)] px-10 py-4 text-xl font-bold text-white shadow-[0_16px_38px_rgba(217,70,239,0.45)] transition hover:shadow-[0_18px_44px_rgba(217,70,239,0.58)] sm:px-14 sm:py-5 sm:text-2xl"
        >
          ابدأ العرض
        </motion.button>
      </div>
    </motion.div>
  )
}

class FireworksEngine {
  private readonly ctx: CanvasRenderingContext2D
  private readonly canvas: HTMLCanvasElement
  private readonly config: FireworksConfig
  private readonly targetFrameTime: number
  private readonly maxParticles: number
  private readonly maxMessages: number
  private readonly maxImages: number

  private running = false
  private animationId = 0
  private lastFrameTime = 0

  private rockets: Rocket[] = []
  private particles: Particle[] = []
  private messages: FloatingMessage[] = []
  private images: FloatingImage[] = []

  private particlePool: Particle[] = []
  private readonly maxPoolSize = 1000

  private rocketInterval = 0
  private messageInterval = 0
  private imageInterval = 0

  private readonly imageCache = new Map<string, HTMLImageElement>()

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: FireworksConfig) {
    this.ctx = ctx
    this.canvas = canvas
    this.config = config

    const quality = config.performance.quality
    this.targetFrameTime = 1000 / (quality === 'low' ? 30 : 60)
    this.maxParticles = Math.max(700, Math.min(2600, config.performance.particleCount * 14))
    this.maxMessages = quality === 'low' ? 4 : quality === 'medium' ? 6 : 8
    this.maxImages = quality === 'low' ? 2 : quality === 'medium' ? 3 : 4
  }

  start() {
    if (this.running) return

    this.running = true
    this.lastFrameTime = performance.now()
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.launchRocket()
    this.animationId = requestAnimationFrame(this.animate)

    this.rocketInterval = window.setInterval(() => {
      if (this.running) this.launchRocket()
    }, this.config.performance.rocketFrequency)

    if (this.config.settings.showMessages && this.config.messages.length > 0) {
      this.messageInterval = window.setInterval(() => {
        if (this.running) this.spawnMessage()
      }, this.config.performance.messageFrequency)
    }

    if (this.config.settings.showImages && this.config.images.length > 0) {
      this.imageInterval = window.setInterval(() => {
        if (this.running) this.spawnImage()
      }, this.config.performance.imageFrequency)
    }
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.animationId)
    window.clearInterval(this.rocketInterval)
    window.clearInterval(this.messageInterval)
    window.clearInterval(this.imageInterval)

    this.rockets = []
    this.particles = []
    this.messages = []
    this.images = []
    this.particlePool = []
    this.imageCache.clear()
  }

  private launchRocket() {
    const x = Math.random() * this.canvas.width
    const targetY = this.canvas.height * (0.12 + Math.random() * 0.4)
    this.rockets.push(new Rocket(x, this.canvas.height + 20, targetY))
  }

  private spawnMessage() {
    if (this.messages.length >= this.maxMessages) return
    const index = Math.floor(Math.random() * this.config.messages.length)
    const text = this.config.messages[index]
    if (!text) return
    this.messages.push(
      new FloatingMessage(text, this.canvas.width, this.canvas.height),
    )
  }

  private spawnImage() {
    if (this.images.length >= this.maxImages) return
    const index = Math.floor(Math.random() * this.config.images.length)
    const source = this.config.images[index]
    if (!source) return

    const image = this.getCachedImage(source)
    this.images.push(new FloatingImage(image, this.canvas.width, this.canvas.height))
  }

  private getCachedImage(source: string) {
    const cached = this.imageCache.get(source)
    if (cached) return cached

    const image = new Image()
    image.src = source
    this.imageCache.set(source, image)
    return image
  }

  private explode(x: number, y: number) {
    if (this.particles.length > this.maxParticles) return

    const colors = ['#d946ef', '#a855f7', '#fbbf24', '#ff6b9d', '#ffffff']
    const count = this.config.performance.particleCount

    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.25
      const speed = 1.7 + Math.random() * 3.3
      const size = 1.4 + Math.random() * 2.3
      const color = colors[(Math.random() * colors.length) | 0] ?? '#ffffff'
      this.particles.push(this.getParticle(x, y, angle, speed, color, size))
    }
  }

  private getParticle(
    x: number,
    y: number,
    angle: number,
    speed: number,
    color: string,
    size: number,
  ) {
    const pooled = this.particlePool.pop()
    if (!pooled) return new Particle(x, y, angle, speed, color, size)
    pooled.reset(x, y, angle, speed, color, size)
    return pooled
  }

  private returnParticle(particle: Particle) {
    if (this.particlePool.length < this.maxPoolSize) {
      this.particlePool.push(particle)
    }
  }

  private animate = (currentTime: number) => {
    if (!this.running) return

    const elapsed = currentTime - this.lastFrameTime
    if (elapsed < this.targetFrameTime) {
      this.animationId = requestAnimationFrame(this.animate)
      return
    }
    this.lastFrameTime = currentTime - (elapsed % this.targetFrameTime)

    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.fillStyle =
      this.config.performance.quality === 'low'
        ? 'rgba(0,0,0,0.26)'
        : 'rgba(0,0,0,0.16)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.globalCompositeOperation = 'lighter'
    this.rockets = this.rockets.filter((rocket) => {
      rocket.update()
      rocket.draw(this.ctx)
      if (rocket.y <= rocket.targetY) {
        this.explode(rocket.x, rocket.y)
        return false
      }
      return true
    })

    this.particles = this.particles.filter((particle) => {
      particle.update()
      particle.draw(this.ctx)
      const alive = particle.life > 0
      if (!alive) this.returnParticle(particle)
      return alive
    })

    this.ctx.globalCompositeOperation = 'source-over'
    this.messages = this.messages.filter((message) => {
      message.update()
      message.draw(this.ctx)
      return message.life > 0
    })

    this.images = this.images.filter((image) => {
      image.update()
      image.draw(this.ctx)
      return image.life > 0
    })

    this.animationId = requestAnimationFrame(this.animate)
  }
}

class Rocket {
  x: number
  y: number
  targetY: number
  private speed: number
  private drift: number

  constructor(x: number, y: number, targetY: number) {
    this.x = x
    this.y = y
    this.targetY = targetY
    this.speed = 5.2 + Math.random() * 2.2
    this.drift = (Math.random() - 0.5) * 0.8
  }

  update() {
    this.y -= this.speed
    this.x += this.drift
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2.3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.32)'
    ctx.fillRect(this.x - 1, this.y + 2, 2, 11)
  }
}

class Particle {
  x = 0
  y = 0
  vx = 0
  vy = 0
  life = 0
  maxLife = 0
  color = '#ffffff'
  size = 2
  gravity = 0.055

  constructor(
    x: number,
    y: number,
    angle: number,
    speed: number,
    color: string,
    size: number,
  ) {
    this.reset(x, y, angle, speed, color, size)
  }

  reset(
    x: number,
    y: number,
    angle: number,
    speed: number,
    color: string,
    size: number,
  ) {
    this.x = x
    this.y = y
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.life = 95 + Math.random() * 35
    this.maxLife = this.life
    this.color = color
    this.size = size
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.985
    this.vy = this.vy * 0.985 + this.gravity
    this.life -= 1
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return
    ctx.globalAlpha = this.life / this.maxLife
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

class FloatingMessage {
  x: number
  y: number
  text: string
  life = 240
  private readonly maxLife = 240
  private readonly vy: number
  private readonly vx: number

  constructor(text: string, canvasWidth: number, canvasHeight: number) {
    this.text = text
    this.x = canvasWidth * (0.2 + Math.random() * 0.6)
    this.y = canvasHeight + 20
    this.vy = -0.55 - Math.random() * 0.45
    this.vx = (Math.random() - 0.5) * 0.35
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.life -= 1
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return
    const alpha = Math.min(1, this.life / this.maxLife)
    ctx.globalAlpha = alpha
    ctx.font = '700 20px Cairo, Tajawal, sans-serif'
    ctx.fillStyle = '#ffc1e9'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(255, 105, 180, 0.85)'
    ctx.shadowBlur = 18
    ctx.fillText(this.text, this.x, this.y)
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }
}

class FloatingImage {
  x: number
  y: number
  image: HTMLImageElement
  life = 320
  private readonly maxLife = 320
  private readonly vy: number
  private readonly vx: number
  private readonly size: number
  private rotation = 0
  private readonly spin: number

  constructor(image: HTMLImageElement, canvasWidth: number, canvasHeight: number) {
    this.image = image
    this.x = canvasWidth * (0.15 + Math.random() * 0.7)
    this.y = canvasHeight + 80
    this.vy = -0.45 - Math.random() * 0.35
    this.vx = (Math.random() - 0.5) * 0.25
    this.size = 72 + Math.random() * 34
    this.spin = (Math.random() - 0.5) * 0.01
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.rotation += this.spin
    this.life -= 1
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return
    if (!this.image.complete || this.image.naturalWidth === 0) return

    const alpha = Math.min(1, this.life / this.maxLife)
    const half = this.size / 2

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.shadowColor = 'rgba(217, 70, 239, 0.72)'
    ctx.shadowBlur = 22
    ctx.beginPath()
    ctx.arc(0, 0, half, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(this.image, -half, -half, this.size, this.size)
    ctx.restore()

    ctx.globalAlpha = 1
  }
}
