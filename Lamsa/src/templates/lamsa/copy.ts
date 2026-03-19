import type { GiftLocale } from '../../types/gift'

export interface LamsaCopy {
  badge: string
  passwordTitle: string
  passwordSubtitle: string
  passwordPlaceholder: string
  passwordLabel: string
  passwordHint: string
  passwordError: string
  unlockButton: string
  revealTitle: string
  revealSubtitle: string
  welcomeEyebrow: string
  welcomeTitle: string
  welcomeText: string
  dateEyebrow: string
  dateTitle: string
  dateLabel: string
  dateCaption: string
  photosEyebrow: string
  photosTitle: string
  photosCaption: string
  photoAltPrefix: string
  messageEyebrow: string
  messageTitle: string
  messageIntro: string
  closingEyebrow: string
  closingTitle: string
  closingText: string
  signaturePrefix: string
  invalidConfigTitle: string
  invalidConfigText: string
}

export const lamsaCopy: Record<GiftLocale, LamsaCopy> = {
  en: {
    badge: 'Private Gift',
    passwordTitle: 'A private moment made just for you.',
    passwordSubtitle:
      'This page was created as a personal surprise. Enter the password to open it.',
    passwordPlaceholder: 'Enter password',
    passwordLabel: 'Password',
    passwordHint: 'Keep this page private between both of you.',
    passwordError: 'That password is not correct yet.',
    unlockButton: 'Open Gift',
    revealTitle: 'One small moment...',
    revealSubtitle: 'Something beautiful is waiting for you.',
    welcomeEyebrow: 'Welcome',
    welcomeTitle: 'For someone deeply loved',
    welcomeText: 'A quiet little page carrying warm memories and one honest message.',
    dateEyebrow: 'Meaningful Date',
    dateTitle: 'A day we still carry in our hearts',
    dateLabel: 'Date',
    dateCaption: 'Some days never fade, they only become more precious.',
    photosEyebrow: 'Photo Memories',
    photosTitle: 'Four snapshots from our story',
    photosCaption: 'Simple moments that still feel close.',
    photoAltPrefix: 'Memory photo',
    messageEyebrow: 'Love Message',
    messageTitle: 'One note from the heart',
    messageIntro: 'Just one message, because one sincere line can be enough.',
    closingEyebrow: 'Closing Note',
    closingTitle: 'Thank you for being my calm',
    closingText:
      'This little gift may be simple, but every detail was chosen with care for you.',
    signaturePrefix: 'With love,',
    invalidConfigTitle: 'Template data needs attention',
    invalidConfigText:
      'Lamsa requires exactly four photo paths in the customer config file.',
  },
  ar: {
    badge: '🎁هديتك يا قلبي',
    passwordTitle: 'مفاجأة معمولة مخصوص ليكي يا روحي🎉',
    passwordSubtitle: '🌚الويبسايت ده عشانك بس، اكتبي الباسوورد عشان تفتحيه.',
    passwordPlaceholder: 'بلا اكتبي الباسوورد هنا',
    passwordLabel: 'الباسوورد بتاعنا🔒',
    passwordHint: 'باعتلك الباسوورد في الشات بتاعنا💕',
    passwordError: 'مش دي الباسوورد يا حبيبتي ركزي😂',
    unlockButton: 'افتحي هديتك🗝️',
    revealTitle: 'بيفتح اهو..',
    revealSubtitle: 'الصبر يا بنتي متستعجليش😂',
    welcomeEyebrow: 'عيد حبنا❤️',
    welcomeTitle: 'ليكي يا أغلى الناس💋',
    welcomeText: 'أتمنى الويبسايت ده يعبر عن قد إيه بحبك وبقدر الذكريات الحلوة اللي عشناها سوا.🌹',
    dateEyebrow: 'تاريخ حبنا👩‍❤️‍👨',
    dateTitle: 'يوم لسه محفور في قلبنا مش هننساه💖',
    dateLabel: 'التاريخ',
    dateCaption: 'اليوم ده مش هنساه ابدا وده يوم مميز في حياتنا. ممتن لأني عشته معاكي💖',
    photosEyebrow: 'ذكرياتنا👫',
    photosTitle: 'أربع لحظات من حكايتنا',
    photosCaption: 'لحظات مختلفة من حكايتنا',
    photoAltPrefix: 'صورة ذكرى',
    messageEyebrow: 'رسالة حب💌',
    messageTitle: 'حاجه حابب اقولهالك',
    messageIntro: 'من كل قلبي اللي هقولهولك ده.❤️',
    closingEyebrow: 'حاجه أخيرة',
    closingTitle: 'شكرًا لأنكِ معايا❤️',
    closingText: 'الهدية بسيطة، لكن كل تفصيل فيها اخترته بحب عشانك.',
    signaturePrefix: 'حبيبك،❤️',
    invalidConfigTitle: 'بيانات القالب تحتاج تعديل',
    invalidConfigText: 'باقة لمسة تتطلب 4 مسارات صور فقط داخل ملف البيانات.',
  },
}
