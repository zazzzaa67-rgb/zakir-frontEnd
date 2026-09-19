import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    emoji: '🎓',
    accent: '#1E6FF0',
    accentLight: '#EFF6FF',
    illustration: ['📖', '🤖', '💡'],
    title: 'المذاكرة بقت أسهل',
    body: 'اختار الدرس والـ AI يشرحهولك بطريقة بسيطة وممتعة.',
  },
  {
    emoji: '🎬',
    accent: '#7C3AED',
    accentLight: '#F5F3FF',
    illustration: ['🎥', '📊', '✏️'],
    title: 'اتعلم بطريقتك',
    body: 'فيديو + PowerPoint + رسومات + شرح بالمصري.',
  },
  {
    emoji: '🏆',
    accent: '#F59E0B',
    accentLight: '#FFFBEB',
    illustration: ['🏅', '🔥', '⭐'],
    title: 'كل إنجاز بيقرّبك لهدفك',
    body: 'اجمع Points، افتح دروس، وطوّر مستواك.',
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#F8F9FF' }}>
      {/* Skip */}
      <div className="flex justify-start px-6 pt-12 pb-0">
        <button
          onClick={() => navigate('/auth')}
          className="text-sm font-semibold text-slate-400 px-3 py-1.5 rounded-xl active:bg-slate-100 transition-colors cursor-pointer"
        >
          تخطي
        </button>
      </div>

      {/* Illustration area */}
      <div
        className="mx-6 mt-6 rounded-3xl flex flex-col items-center justify-center gap-4 py-10 relative overflow-hidden"
        style={{ background: slide.accentLight, minHeight: 280 }}
      >
        {/* Background decoration */}
        <div
          className="absolute top-4 right-4 w-24 h-24 rounded-full opacity-20"
          style={{ background: slide.accent }}
        />
        <div
          className="absolute bottom-4 left-4 w-16 h-16 rounded-full opacity-10"
          style={{ background: slide.accent }}
        />

        {/* Main icon */}
        <div
          className="w-28 h-28 rounded-[28px] flex items-center justify-center text-6xl"
          style={{
            background: `linear-gradient(135deg, ${slide.accent}22, ${slide.accent}44)`,
            border: `2px solid ${slide.accent}33`,
            boxShadow: `0 8px 32px ${slide.accent}30`,
          }}
        >
          {slide.emoji}
        </div>

        {/* Mini icons */}
        <div className="flex gap-4">
          {slide.illustration.map((icon, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: 'white',
                boxShadow: `0 4px 16px ${slide.accent}20`,
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1 flex flex-col items-center px-8 pt-8">
        <h2
          className="text-3xl font-black text-slate-900 text-center mb-3 leading-tight"
        >
          {slide.title}
        </h2>
        <p className="text-center text-slate-500 text-base leading-relaxed font-medium">
          {slide.body}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all cursor-pointer"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? slide.accent : '#E2E8F0',
            }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="px-6 pb-10 flex flex-col gap-3">
        {isLast ? (
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg active:scale-95 transition-transform cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${slide.accent}, #7C3AED)`,
              boxShadow: `0 8px 24px ${slide.accent}50`,
            }}
          >
            ابدأ الآن 🚀
          </button>
        ) : (
          <button
            onClick={() => setCurrent(current + 1)}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg active:scale-95 transition-transform cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${slide.accent}, #1D4ED8)`,
              boxShadow: `0 8px 24px ${slide.accent}50`,
            }}
          >
            التالي →
          </button>
        )}
      </div>
    </div>
  );
}
