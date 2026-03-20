import type { ZekraConfig } from '../types/zekra'

export const zekraConfig: ZekraConfig = {
  receiverName: 'مريم',
  senderName: 'كريم',
  unlockDate: {
    year: 2024,
    month: 3,
    day: 15,
  },
  locale: 'ar',
  introLine: 'ذكرى صغيرة، لكن كل تفاصيلها معمولة بحب عشانك.',
  loadingGifSrc: '/images/zekra/bear-hug.gif',
  loadingGifAlt: 'Two bears hugging',
  messages: [
    {
      id: 'note-1',
      coverLabel: 'الوعد الأول',
      title: 'أنتِ بيتي الهادئ',
      body: 'كل مرة الدنيا تتعبني، مجرد صوتك بيرجعني لقلبي. وجودك في حياتي رزق أختاره كل يوم من جديد.',
      emoji: '💗',
    },
    {
      id: 'note-2',
      coverLabel: 'ذكرى دافئة',
      title: 'ضحكتك أجمل مشهد',
      body: 'ضحكتك هي المشهد الوحيد اللي مستحيل أتخطاه. حتى في الأيام السريعة، أنتِ أجمل حاجة ثابتة في روحي.',
      emoji: '🌙',
    },
    {
      id: 'note-3',
      coverLabel: 'رسالة سرية',
      title: 'الحب عندي اسمه أنتِ',
      body: 'يمكن الكلام قليل، لكن حبي ليكِ كبير وواضح. كل لحظة بينا بتأكدلي إن اختياري كان صح من أول مرة.',
      emoji: '∞',
    },
  ],
  photos: [
    {
      src: '/images/zekra/stocksnap-couple_1.jpg',
      caption: 'مساء طويل وهدوء شبهنا.',
    },
    {
      src: '/images/zekra/stocksnap-couple_2.jpg',
      caption: 'نظرة واحدة كانت كفاية.',
    },
    {
      src: '/images/zekra/stocksnap-couple_3.jpg',
      caption: 'ضحكة خفيفة وبداية يوم جميل.',
    },
    {
      src: '/images/zekra/stocksnap-couple_4.jpg',
      caption: 'وقت بسيط لكنه غالي.',
    },
    {
      src: '/images/zekra/stocksnap-couple_2.jpg',
      caption: 'لقطة صغيرة من حكاية كبيرة.',
    },
    {
      src: '/images/zekra/stocksnap-couple_1.jpg',
      caption: 'أجمل نهاية يوم كانت معك.',
    },
  ],
  finalFloatingMessage:
    'مهما الأيام تتغير، قلبي ثابت على حبك. شكرًا لأنك في حياتي بكل هذا النور.',
  finalFloatingLines: [
    'كل سنة وأنتِ طيبة يا أجمل هدية في عمري.',
    'وجودك بجانبي يخلّي الدنيا أخف وأهدأ.',
    'أنا ممتن لكل لحظة جمعتنا.',
    'والأجمل لسه جاي معكِ.',
  ],
}
