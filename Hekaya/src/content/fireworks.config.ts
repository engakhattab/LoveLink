export type FireworksQuality = 'low' | 'medium' | 'high'

export interface FireworksConfig {
  recipientName: string
  senderName: string
  images: string[]
  messages: string[]
  settings: {
    duration: number
    autoStart: boolean
    showMessages: boolean
    showImages: boolean
    musicEnabled: boolean
    musicUrl?: string
  }
  performance: {
    quality: FireworksQuality
    particleCount: number
    messageFrequency: number
    imageFrequency: number
    rocketFrequency: number
  }
}

const PERFORMANCE_PRESETS: Record<
  FireworksQuality,
  Omit<FireworksConfig['performance'], 'quality'>
> = {
  low: {
    particleCount: 50,
    messageFrequency: 3500,
    imageFrequency: 6000,
    rocketFrequency: 800,
  },
  medium: {
    particleCount: 100,
    messageFrequency: 2500,
    imageFrequency: 4500,
    rocketFrequency: 500,
  },
  high: {
    particleCount: 200,
    messageFrequency: 1800,
    imageFrequency: 3200,
    rocketFrequency: 380,
  },
}

export const defaultFireworksConfig: FireworksConfig = {
  recipientName: 'حبيبتي',
  senderName: 'أنا',
  images: [
    '/images/memory1.jpg',
    '/images/memory2.jpg',
    '/images/memory3.jpg',
  ],
  messages: [
    'كل سنة وإنتِ حبيبتي',
    'سنة أولى حب وحياة',
    'وكل سنة وإنتِ معايا',
    'أحبك يا أحلى هدية في حياتي',
    'معاكِ كل لحظة عيد',
  ],
  settings: {
    duration: 45,
    autoStart: true,
    showMessages: true,
    showImages: true,
    musicEnabled: true,
    musicUrl: '/audio/fireworks-music.mp3',
  },
  performance: {
    quality: 'medium',
    ...PERFORMANCE_PRESETS.medium,
  },
}

function getDeviceCapabilities() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return {
      isMobile: false,
      cores: 4,
      memory: 4,
      reducedMotion: false,
    }
  }

  const userAgent = navigator.userAgent
  const mobileMatch = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
  const cores = navigator.hardwareConcurrency ?? 2
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    isMobile: mobileMatch,
    cores,
    memory,
    reducedMotion,
  }
}

export const getOptimizedConfig = (): FireworksConfig => {
  const capabilities = getDeviceCapabilities()

  let quality: FireworksQuality = 'medium'

  if (
    capabilities.reducedMotion ||
    capabilities.isMobile ||
    capabilities.cores <= 2 ||
    capabilities.memory <= 3
  ) {
    quality = 'low'
  } else if (capabilities.cores >= 8 && capabilities.memory >= 8) {
    quality = 'high'
  }

  return {
    ...defaultFireworksConfig,
    performance: {
      quality,
      ...PERFORMANCE_PRESETS[quality],
    },
  }
}
