import { NavProps } from '../App';

const summaryCards = [
  {
    icon: '💡',
    title: 'أهم الأفكار',
    color: '#1E6FF0',
    bg: '#EFF6FF',
    items: [
      'المعادلة الخطية هي معادلة الدرجة الأولى',
      'الشكل العام: ax + b = c حيث a ≠ 0',
      'الحل: عزل المتغير بالعمليات العكسية',
    ],
  },
  {
    icon: '📐',
    title: 'القوانين',
    color: '#7C3AED',
    bg: '#F5F3FF',
    items: [
      'ax + b = c → x = (c - b) / a',
      'الجمع على الطرفين مسموح',
      'الضرب على الطرفين مسموح',
    ],
  },
  {
    icon: '📖',
    title: 'المصطلحات',
    color: '#F97316',
    bg: '#FFF7ED',
    items: [
      'المتغير: الحرف المجهول (x, y)',
      'المعامل: الرقم أمام المتغير',
      'الثابت: العدد المستقل',
    ],
  },
  {
    icon: '🔢',
    title: 'أمثلة مهمة',
    color: '#10B981',
    bg: '#F0FDF4',
    items: [
      '2x + 3 = 11 → x = 4',
      '5x - 10 = 15 → x = 5',
      '3x = 21 → x = 7',
    ],
  },
];

export default function LessonSummaryScreen({ navigate }: NavProps) {
  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #7C3AED 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('quiz')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            <span>اختبر نفسك 🧠</span>
          </button>
          <button onClick={() => navigate('ai_lesson')} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <span className="text-white font-bold">→</span>
          </button>
        </div>
        <h1 className="text-2xl font-black text-white text-right mb-1">ملخص الدرس 📝</h1>
        <p className="text-blue-200 text-sm font-medium text-right">المعادلات الخطية • رياضيات</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl mb-4 overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            {/* Card header */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: card.bg }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: card.color + '22' }}
              >
                {card.icon}
              </div>
              <span className="font-black text-slate-900 text-base flex-1 text-right">{card.title}</span>
            </div>

            {/* Card items */}
            <div className="px-4 py-3">
              {card.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <p className="text-slate-700 text-sm font-medium leading-relaxed text-right flex-1">{item}</p>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: card.color + '18' }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Ask AI section */}
        <div
          className="rounded-2xl p-5 text-center mb-4"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
            boxShadow: '0 4px 20px rgba(49,46,129,0.3)',
          }}
        >
          <div className="text-4xl mb-3">🤖</div>
          <div className="text-white font-black text-lg mb-2">اسأل AI عن أي نقطة</div>
          <p className="text-indigo-300 text-sm font-medium mb-4">مش فاهم حاجة؟ اسألني وهفسرهالك!</p>
          <button
            onClick={() => navigate('ai_lesson')}
            className="px-8 py-3 rounded-xl text-white font-bold text-sm active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)', boxShadow: '0 4px 16px rgba(30,111,240,0.4)' }}
          >
            ابدأ المحادثة 💬
          </button>
        </div>

        {/* Next lesson button */}
        <button
          onClick={() => navigate('quiz')}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
            boxShadow: '0 8px 24px rgba(30,111,240,0.4)',
          }}
        >
          اختبر نفسك 🧠
        </button>
      </div>
    </div>
  );
}
