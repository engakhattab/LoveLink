export type HekayaLocale = 'ar' | 'en'

export type HekayaStage =
  | 'locked_heart'
  | 'entering'
  | 'unlocked'
  | 'finale'
  | 'final_reveal'
  | 'complete'

export interface UnlockDateConfig {
  year: number
  month: number
  day: number
  displayFormat?: string
}

export interface UnlockConfig {
  type: 'ceremonial_heart'
  unlockDate: UnlockDateConfig
  longPressRequired?: boolean
  ceremonyMessage?: string
}

export interface ChapterXOGameLockConfig {
  enabled: boolean
  theme: 'hearts' | 'stars' | 'custom'
  playerSymbol: string
  opponentSymbol: string
  autoWinMode: boolean
  maxMoves: number
  introMessage: string
  transitionMessage: string
  transitionDuration: number
}

export interface ChapterPhoto {
  src: string
  alt: string
  caption?: string
}

export interface QuestionMoment {
  id: string
  question: string
  position: 'start' | 'middle' | 'end'
}

export interface VoiceNote {
  src: string
  duration?: number
  label?: string
}

export interface Chapter {
  id: string
  title: string
  dateRange?: string
  narrative: string
  photos: ChapterPhoto[]
  message: string
  voiceNote?: VoiceNote
  question?: QuestionMoment
  theme?: {
    accentColor?: string
    background?: string
  }
  xoGameLock?: ChapterXOGameLockConfig
}

export interface ConstellationConfig {
  enabled: boolean
  title: string
  subtitle: string
  memories: ConstellationMemory[]
}

export interface ConstellationMemory {
  id: string
  photo: string
  caption: string
  x: number
  y: number
  brightness: 'dim' | 'medium' | 'bright'
  size: 'small' | 'medium' | 'large'
}

export interface FireworksConfig {
  enabled: boolean
  title: string
  floatingMessages: string[]
  celebrationPhotos: string[]
  duration: number
  autoTrigger: boolean
}

export interface SealedEnvelopeConfig {
  enabled: boolean
  unlockDate?: string
  unlockAfterDays?: number
  previewText: string
  sealedMessage: string
  voiceNote?: VoiceNote
}

export interface FinalRevealConfig {
  backgroundPhoto?: string
  message: string
  splitLines?: string[]
  closingNote?: string
  voiceNote?: VoiceNote
}

export interface ChapterProgress {
  chapterId: string
  viewed: boolean
  viewedAt?: Date
  xoGameCompleted?: boolean
  xoGameCompletedAt?: Date
}

export interface HekayaProgress {
  chaptersViewed: number[]
  chapterProgress: ChapterProgress[]
  questionsAnswered: number[]
  constellationExplored: boolean
  sealedOpened: boolean
  fireworksTriggered: boolean
  finalRevealed: boolean
  completedAt?: Date
}

export interface HekayaConfig {
  locale: HekayaLocale
  receiverName: string
  senderName: string
  unlock: UnlockConfig
  introLine?: string
  chapters: Chapter[]
  constellation: ConstellationConfig
  fireworks: FireworksConfig
  sealedEnvelope: SealedEnvelopeConfig
  finalReveal: FinalRevealConfig
  theme?: {
    customAccent?: string
    customGold?: string
  }
  reflectiveQuestions?: string[]
}

export interface HekayaValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

function isInvalidCalendarDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day)
  return (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
}

export function validateHekayaConfig(config: HekayaConfig): HekayaValidation {
  const errors: string[] = []
  const warnings: string[] = []

  if (!config.receiverName) errors.push('Receiver name is required')
  if (!config.senderName) errors.push('Sender name is required')
  if (!config.unlock?.unlockDate) errors.push('Unlock date is required')

  const { year, month, day } = config.unlock.unlockDate
  if (isInvalidCalendarDate(year, month, day)) {
    errors.push('Invalid unlock date')
  }

  if (!config.chapters || config.chapters.length === 0) {
    errors.push('At least 1 chapter is required')
  }

  config.chapters.forEach((chapter, index) => {
    if (!chapter.title) errors.push(`Chapter ${index + 1}: title is required`)
    if (!chapter.photos || chapter.photos.length < 2) {
      errors.push(`Chapter ${index + 1}: at least 2 photos required`)
    }
    if (chapter.photos.length > 4) {
      warnings.push(
        `Chapter ${index + 1}: more than 4 photos may feel overwhelming`,
      )
    }
    if (!chapter.message) errors.push(`Chapter ${index + 1}: message is required`)

    if (chapter.xoGameLock?.enabled) {
      if (!chapter.xoGameLock.introMessage) {
        errors.push(`Chapter ${index + 1}: xoGameLock introMessage is required`)
      }
      if (!chapter.xoGameLock.transitionMessage) {
        errors.push(
          `Chapter ${index + 1}: xoGameLock transitionMessage is required`,
        )
      }
      if (chapter.xoGameLock.maxMoves <= 0) {
        errors.push(`Chapter ${index + 1}: xoGameLock maxMoves must be > 0`)
      }
    }
  })

  if (config.constellation.enabled) {
    if (
      !config.constellation.memories ||
      config.constellation.memories.length === 0
    ) {
      errors.push('Constellation enabled but no memories provided')
    }
  }

  if (config.fireworks.enabled) {
    if (
      !config.fireworks.floatingMessages ||
      config.fireworks.floatingMessages.length < 5
    ) {
      warnings.push('Fireworks: at least 10 floating messages recommended')
    }
  }

  if (config.sealedEnvelope.enabled) {
    if (
      !config.sealedEnvelope.unlockDate &&
      !config.sealedEnvelope.unlockAfterDays
    ) {
      errors.push('Sealed envelope: must specify unlockDate OR unlockAfterDays')
    }
    if (
      config.sealedEnvelope.unlockAfterDays !== undefined &&
      config.sealedEnvelope.unlockAfterDays <= 0
    ) {
      errors.push('Sealed envelope: unlockAfterDays must be greater than 0')
    }
    if (
      config.sealedEnvelope.unlockDate &&
      Number.isNaN(new Date(config.sealedEnvelope.unlockDate).getTime())
    ) {
      errors.push('Sealed envelope: unlockDate must be a valid ISO date string')
    }
    if (!config.sealedEnvelope.sealedMessage) {
      errors.push('Sealed envelope: message is required')
    }
  }

  if (!config.finalReveal.message) {
    errors.push('Final reveal message is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
