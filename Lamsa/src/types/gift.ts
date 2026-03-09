export type GiftLocale = 'en' | 'ar'

export type GiftPhotoSet = [string, string, string, string]

export interface GiftTemplateConfig {
  password: string
  receiverName: string
  senderName: string
  meaningfulDate: string
  message: string
  photos: GiftPhotoSet
  locale: GiftLocale
}
