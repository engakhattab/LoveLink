import type { ZekraLocale } from '../../types/zekra'

export interface ZekraCopy {
  lockKicker: string
  lockTitle: string
  lockSubtitle: string
  yearLabel: string
  monthLabel: string
  dayLabel: string
  wrongDateText: string
  unlockButton: string
  loadingTitle: string
  loadingText: string
  loadingFallback: string
  heroKicker: string
  heroTitle: string
  heroSubline: string
  counterKicker: string
  counterTitle: string
  yearsLabel: string
  monthsLabel: string
  hoursLabel: string
  minutesLabel: string
  secondsLabel: string
  messagesKicker: string
  messagesTitle: string
  revealHint: string
  swipeHint: string
  photosKicker: string
  photosTitle: string
  finalKicker: string
  finalTitle: string
  finalButtonClosed: string
  finalReturnButton: string
  invalidConfigTitle: string
  invalidConfigText: string
  photoAltPrefix: string
}

export const zekraCopy: Record<ZekraLocale, ZekraCopy> = {
  en: {
    lockKicker: 'Private Date Lock',
    lockTitle: 'A heart remembers one date only.',
    lockSubtitle: 'Choose your meaningful date to open this personal gift.',
    yearLabel: 'Year',
    monthLabel: 'Month',
    dayLabel: 'Day',
    wrongDateText: 'That date is not the right memory yet.',
    unlockButton: 'Unlock Zekra',
    loadingTitle: 'One sweet moment...',
    loadingText: 'Two little bears are carrying your memory to you.',
    loadingFallback:
      'Drop your hugging GIF in /public/images/zekra/hugging-bears.gif',
    heroKicker: 'Zekra',
    heroTitle: 'Our memory still glows',
    heroSubline: 'A richer romantic chapter made to be felt, not just read.',
    counterKicker: 'Love Counter',
    counterTitle: 'How long this feeling has lived',
    yearsLabel: 'Years',
    monthsLabel: 'Months',
    hoursLabel: 'Hours',
    minutesLabel: 'Minutes',
    secondsLabel: 'Seconds',
    messagesKicker: 'Hidden Notes',
    messagesTitle: 'Three cards, three pieces of the heart',
    revealHint: 'Tap any card to reveal the hidden message',
    swipeHint: 'Swipe left or right to move between cards',
    photosKicker: 'Memory Gallery',
    photosTitle: 'Six moments with a warm pulse',
    finalKicker: 'Final Reveal',
    finalTitle: 'A letter only for you',
    finalButtonClosed: 'Open the hidden message',
    finalReturnButton: 'Return to your present',
    invalidConfigTitle: 'Zekra config needs correction',
    invalidConfigText:
      'This template requires exactly 3 messages and exactly 6 photos.',
    photoAltPrefix: 'Memory',
  },
  ar: {
    lockKicker: 'قفل ذكراياتنا',
    lockTitle: 'القلب هيفتح بنفس تاريخ اعترافنا لبعض.',
    lockSubtitle: 'حطي تاريخنا سوا  .',
    yearLabel: 'سنة',
    monthLabel: 'شهر',
    dayLabel: 'يوم',
    wrongDateText: 'مش تاريخنا تعارفنا ده يحبيبتي',
    unlockButton: 'افتحي ذكراباتنا',
    loadingTitle: 'الصبر يحبيبتي...',
    loadingText: 'انا وانتي',
    loadingFallback: 'ضعي ملف GIF في المسار public/images/zekra/hugging-bears.gif',
    heroKicker: 'ذكرى',
    heroTitle: 'حكايتنا لسه بتلمع',
    heroSubline: 'مشاعري ناحيتك صادقة.',
    counterKicker: 'عداد حبنا',
    counterTitle: 'مدة وجودنا مع بعض',
    yearsLabel: 'سنة',
    monthsLabel: 'شهر',
    hoursLabel: 'ساعة',
    minutesLabel: 'دقيقة',
    secondsLabel: 'ثانية',
    messagesKicker: 'بطاقات مخفية',
    messagesTitle: 'ثلاث بطاقات... وثلاث رسائل من القلب',
    revealHint: 'اضغطي على البطاقة عشان تكتشفي رسالتها',
    swipeHint: 'اسحبي يمين أو شمال عشان تشوفي باقي البطاقات',
    photosKicker: 'معرض ذكراياتنا',
    photosTitle: 'ست لحظات دافية بينا',
    finalKicker: 'الرسالة الأخيرة',
    finalTitle: 'رسالة خاصة ليكي يا روحي',
    finalButtonClosed: 'افتحي الرسالة ',
    finalReturnButton: 'ارجعي لهديتك',
    invalidConfigTitle: 'بيانات ذكرى تحتاج تعديل',
    invalidConfigText: 'قالب ذكرى يتطلب 3 رسائل بالضبط و6 صور بالضبط.',
    photoAltPrefix: 'ذكرى',
  },
}
