export type ZekraLocale = 'en' | 'ar'

export interface UnlockDate {
  year: number
  month: number
  day: number
}

export interface ZekraMessage {
  id: string
  coverLabel: string
  title: string
  body: string
  emoji: string
}

export interface ZekraPhoto {
  src: string
  caption: string
}

export type ZekraMessageSet = [ZekraMessage, ZekraMessage, ZekraMessage]
export type ZekraPhotoSet = [
  ZekraPhoto,
  ZekraPhoto,
  ZekraPhoto,
  ZekraPhoto,
  ZekraPhoto,
  ZekraPhoto,
]

export interface ZekraTheme {
  roseMain?: string
  roseDeep?: string
  goldAccent?: string
  bgVoid?: string
}

export interface ZekraConfig {
  receiverName: string
  senderName: string
  unlockDate: UnlockDate
  locale: ZekraLocale
  introLine: string
  loadingGifSrc?: string
  loadingGifAlt?: string
  messages: ZekraMessageSet
  photos: ZekraPhotoSet
  finalFloatingMessage: string
  finalFloatingLines?: string[]
  theme?: ZekraTheme
}
