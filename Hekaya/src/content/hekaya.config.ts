import type { HekayaConfig } from '../types/hekaya'

export const hekayaConfig: HekayaConfig = {
  locale: 'ar',
  receiverName: 'ليلى',
  senderName: 'كريم',

  unlock: {
    type: 'ceremonial_heart',
    unlockDate: {
      year: 2024,
      month: 1,
      day: 14,
      displayFormat: 'DD/MM/YYYY',
    },
    longPressRequired: true,
    ceremonyMessage:
      'الحكاية دي مخبية اللي جوا قلبي ليكي... حطي إيدك على القلب ده واوعديني تفتكري اليوم ده للأبد ❤',
  },

  introLine: 'دي بداية الحكاية... ولسه أجمل الفصول جاية.',

  chapters: [
    {
      id: 'chapter_1',
      title: 'الفصل الأول: البداية',
      dateRange: 'يناير 2024 - مارس 2024',
      narrative:
        'كان في لحظة بسيطة بس غيرت كل حاجة. من أول نظرة عرفت إن بيننا حكاية تستاهل تتكتب.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_1_photo_1.jpg',
          alt: 'أول صورة سوا',
          caption: 'أول ضحكة بينا',
        },
        {
          src: '/images/hekaya/chapters/chapter_1_photo_2.jpg',
          alt: 'لحظة جميلة',
          caption: 'اللحظة اللي كل حاجة بدأت فيها',
        },
      ],
      message:
        'من اليوم ده وأنا عارف إن وجودك في حياتي مش صدفة. انتي النور اللي خلاني أشوف الدنيا بشكل تاني.',
      voiceNote: {
        src: '/audio/chapter_1_voice.mp3.aac',
        label: 'اسمعي رسالتي ليكي',
      },
      question: {
        id: 'q1',
        question: 'إيه أول موقف خلاكي تحسي إن بينا حكاية مختلفة؟',
        position: 'start',
      },
    },
    {
      id: 'chapter_2',
      title: 'الفصل الثاني: أول مغامرة',
      dateRange: 'أبريل 2024 - يونيو 2024',
      narrative:
        'كل خروجة كانت صفحة جديدة، وكل سفرية كانت تثبيت إننا فريق واحد مهما كانت الظروف.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_2_photo_1.jpg',
          alt: 'أول سفرية',
          caption: 'ضحكتنا في الطريق',
        },
        {
          src: '/images/hekaya/chapters/chapter_2_photo_2.jpg',
          alt: 'وقت الغروب',
          caption: 'أجمل غروب وإنتي جنبي',
        },
      ],
      message:
        'كنت فاكر إن الأماكن هي اللي بتصنع الذكريات، لكن اكتشفت إن الذكريات الحقيقية بتتولد وإنتي معايا.',
      question: {
        id: 'q2',
        question: 'إيه أكتر لحظة في مغامراتنا نفسك نعيشها تاني؟',
        position: 'middle',
      },
    },
    {
      id: 'chapter_3',
      title: 'الفصل الثالث: لما الحياة صعبت',
      dateRange: 'يوليو 2024 - سبتمبر 2024',
      xoGameLock: {
        enabled: true,
        theme: 'hearts',
        playerSymbol: '❤',
        opponentSymbol: '✦',
        autoWinMode: true,
        maxMoves: 5,
        introMessage:
          'الفصل ده مختلف شوية...\nمش هتقدري تقرأيه إلا لما تثبتي إنك شاطرة ❤\nيلا نلعب!',
        transitionMessage:
          'اشطر كتكوتة انتي عرفتي الطريق لقلبي وفزتي بيه ❤✨',
        transitionDuration: 3500,
      },
      narrative:
        'مش كل الأوقات كانت حلوة... كان في أيام صعبة وتحديات كبيرة. بس انتي وقفتي جنبي وأنا وقفت جنبك.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_3_photo_1.webp',
          alt: 'وقت صعب',
          caption: 'لما دعمنا بعض',
        },
        {
          src: '/images/hekaya/chapters/chapter_3_photo_2.jpg',
          alt: 'ابتسامة بعد تعب',
          caption: 'وفي النهاية انتصرنا',
        },
      ],
      message:
        'الحب الحقيقي مش في الأيام السهلة... ده في الأيام اللي بنختار فيها إننا نكمل مع بعض رغم كل حاجة.',
      question: {
        id: 'q3',
        question: 'إيه الذكرى اللي مستحيل تنساها؟',
        position: 'end',
      },
    },
    {
      id: 'chapter_4',
      title: 'الفصل الرابع: للأبد يبدأ دلوقتي',
      dateRange: 'أكتوبر 2024 - المستقبل',
      narrative:
        'الحكاية لسه في أولها. كل يوم جديد معاكي هو فصل جديد مكتوب بالحب.',
      photos: [
        {
          src: '/images/hekaya/chapters/chapter_4_photo_1.jpg',
          alt: 'نظرة للمستقبل',
          caption: 'خطوة بخطوة سوا',
        },
        {
          src: '/images/hekaya/chapters/chapter_4_photo_2.jpg',
          alt: 'وعد',
          caption: 'وعدي ليكي: للأبد',
        },
      ],
      message:
        'أنا مش عارف المستقبل شكله إيه، بس عارف إني عايز أعيشه كله معاكي. كل لحظة، وكل يوم.',
      voiceNote: {
        src: '/audio/sealed_promise.mp3.aac',
        label: 'اسمعي وعدي ليكي',
      },
      question: {
        id: 'q4',
        question: 'إيه الحلم الأكبر اللي نفسك نحققه سوا؟',
        position: 'end',
      },
    },
  ],

  constellation: {
    enabled: true,
    title: 'كوكبة ذكرياتنا',
    subtitle: 'كل نجمة هي لحظة من قصتنا ✨',
    memories: [
      {
        id: 'star_1',
        photo: '/images/hekaya/chapters/chapter_1_photo_1.jpg',
        caption: 'أول نظرة',
        x: 20,
        y: 30,
        brightness: 'bright',
        size: 'large',
      },
      {
        id: 'star_2',
        photo: '/images/hekaya/chapters/chapter_2_photo_1.jpg',
        caption: 'أول مغامرة',
        x: 46,
        y: 42,
        brightness: 'medium',
        size: 'medium',
      },
      {
        id: 'star_3',
        photo: '/images/hekaya/chapters/chapter_3_photo_1.webp',
        caption: 'وقت الصعب',
        x: 68,
        y: 58,
        brightness: 'bright',
        size: 'large',
      },
      {
        id: 'star_4',
        photo: '/images/hekaya/chapters/chapter_4_photo_2.jpg',
        caption: 'الوعد',
        x: 35,
        y: 70,
        brightness: 'dim',
        size: 'small',
      },
    ],
  },

  finalCelebrationUrl: 'https://stillwithyou.vercel.app/',

  sealedEnvelope: {
    enabled: true,
    unlockDate: '2028-03-14',
    previewText: 'رسالة للمستقبل 💌',
    sealedMessage:
      'لو وصلتي للرسالة دي، فده معناه إن الحكاية كبرت أكتر وأجمل. وعدي ليكي إن كل سنة جاية هتكون أحلى.',
    voiceNote: {
      src: '/audio/sealed_promise.mp3.aac',
      label: 'اسمعي الوعد المختوم',
    },
  },

  finalReveal: {
    backgroundPhoto: '/images/hekaya/final/final_reveal.jpg',
    message:
      'دي مش مجرد صفحة على الإنترنت...\nدي حكايتنا.\nكل صورة، كل كلمة، كل لحظة.\nبحبك للأبد وأكتر.',
    splitLines: [
      'دي مش مجرد صفحة على الإنترنت...',
      'دي حكايتنا.',
      'كل صورة، كل كلمة، كل لحظة.',
      'بحبك للأبد وأكتر.',
    ],
    closingNote: 'حبيبك، للأبد',
    voiceNote: {
      src: '/audio/sealed_promise.mp3.aac',
      label: 'آخر رسالة',
    },
  },

  theme: {
    customAccent: '#d946ef',
    customGold: '#fbbf24',
  },

  reflectiveQuestions: [
    'إيه أول لحظة حسيت فيها إننا لبعض؟',
    'إيه أكثر حاجة بتحبيها فينا؟',
    'إيه الذكرى اللي مش ممكن تتنسي؟',
    'إيه الوعد اللي محتاجة تسمعيه مني كل يوم؟',
    'إيه الحلم اللي عايزة نحققه سوا؟',
  ],
}
