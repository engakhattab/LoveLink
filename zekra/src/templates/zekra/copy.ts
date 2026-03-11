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
    lockKicker: 'قفل الذكرى',
    lockTitle: 'القلب لا يفتح إلا بتاريخ واحد.',
    lockSubtitle: 'اختاري تاريخنا المميز لفتح هذه الهدية الخاصة.',
    yearLabel: 'سنة',
    monthLabel: 'شهر',
    dayLabel: 'يوم',
    wrongDateText: 'هذا ليس تاريخنا الصحيح بعد.',
    unlockButton: 'افتحي ذكرى',
    loadingTitle: 'لحظة حب صغيرة...',
    loadingText: 'دبدوبان لطيفان يرتبان الذكرى قبل أن تصل لكِ.',
    loadingFallback: 'ضعي ملف GIF في المسار public/images/zekra/hugging-bears.gif',
    heroKicker: 'ذكرى',
    heroTitle: 'حكايتنا ما زالت تلمع',
    heroSubline: 'نسخة أغنى من المشاعر، متوازنة وجميلة.',
    counterKicker: 'عداد الحب',
    counterTitle: 'منذ متى وهذا الشعور معنا',
    yearsLabel: 'سنة',
    monthsLabel: 'شهر',
    hoursLabel: 'ساعة',
    minutesLabel: 'دقيقة',
    secondsLabel: 'ثانية',
    messagesKicker: 'بطاقات مخفية',
    messagesTitle: 'ثلاث بطاقات... وثلاث رسائل من القلب',
    revealHint: 'اضغطي على البطاقة لتكشف رسالتها',
    swipeHint: 'اسحبي يمينًا ويسارًا للتنقل بين البطاقات',
    photosKicker: 'معرض الذكريات',
    photosTitle: 'ست لحظات بنبض دافئ',
    finalKicker: 'الرسالة الأخيرة',
    finalTitle: 'رسالة خاصة لكِ وحدك',
    finalButtonClosed: 'افتحي الرسالة المخفية',
    finalReturnButton: 'العودة إلى هديتك',
    invalidConfigTitle: 'بيانات ذكرى تحتاج تعديل',
    invalidConfigText: 'قالب ذكرى يتطلب 3 رسائل بالضبط و6 صور بالضبط.',
    photoAltPrefix: 'ذكرى',
  },
}
