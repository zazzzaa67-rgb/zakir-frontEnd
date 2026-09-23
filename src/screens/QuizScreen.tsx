import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LessonQuestion, submitExamResult, getStoredProfile } from '../lib/api';

const fallbackQuestions = [
  {
    question: 'إيه الحل الصح لمعادلة: 2x + 6 = 14؟',
    options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
    correct: 1,
    explanation: 'نطرح 6 من الطرفين: 2x = 8، ثم نقسم على 2: x = 4 ✓',
  },
  {
    question: 'لو 3x - 9 = 12، إيه قيمة x؟',
    options: ['x = 1', 'x = 5', 'x = 7', 'x = 9'],
    correct: 2,
    explanation: 'نجمع 9 على الطرفين: 3x = 21، ثم نقسم على 3: x = 7 ✓',
  },
];

interface LocationState {
  questions?: LessonQuestion[];
  lesson?: string;
  lessonId?: string;
}

export default function QuizScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  // جلب الأسئلة الحقيقية المرسلة من الدرس أو استخدام البديلة لو غير موجودة
  const lessonQuestions = state.questions;
  const questions = lessonQuestions?.length
    ? lessonQuestions.map((item) => ({
        question: item.question ?? 'سؤال الدرس',
        options: item.options ?? [],
        correct: item.correct_index ?? 0,
        explanation: item.explanation ?? 'راجع شرح الدرس مع مساعد ذاكر معي.',
      }))
    : fallbackQuestions;

  const lesson = state.lesson || 'الدرس';
  const lessonId = state.lessonId;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q.correct;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResults(true);
      
      // إرسال النتيجة الحقيقية للسيرفر وتحديث الكاش المحلي
      const profile = getStoredProfile();
      if (profile) {
        const percentage = Math.round((score / questions.length) * 100);
        const isPerfectScore = percentage === 100;

        submitExamResult(profile.id, isPerfectScore)
          .then((res) => {
            if (res.profile) {
              localStorage.setItem('zakker_profile', JSON.stringify(res.profile));
            }
            console.log('✅ تم تحديث النقاط بنجاح:', res);
          })
          .catch((err) => {
            console.error('❌ خطأ أثناء تحديث النتيجة:', err);
          });
      }
    }
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
        <div
          className="px-5 pt-12 pb-6"
          style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #7C3AED 100%)' }}
        >
          <h1 className="text-2xl font-black text-white text-right mb-1">نتيجتك 🎯</h1>
          <p className="text-blue-200 text-sm font-medium text-right">{lesson}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 pb-24">
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-36 h-36 rounded-full flex flex-col items-center justify-center mb-4 shadow-lg"
              style={{
                background:
                  percentage >= 70
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : 'linear-gradient(135deg, #F97316, #EF4444)',
              }}
            >
              <div className="text-4xl font-black text-white">
                {score}/{questions.length}
              </div>
              <div className="text-white/80 text-sm font-semibold">{percentage}%</div>
            </div>

            <div
              className="text-3xl font-black mb-1"
              style={{
                background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              +{score * 10} Points 🏆
            </div>
            <p className="text-slate-600 font-medium">
              {percentage >= 80 ? 'ممتاز! أداؤك رائع 🌟' : 'كويس! ممكن تتحسن أكتر 💪'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/ai-lesson', { state: { lesson, lessonId } })}
              className="w-full py-4 rounded-2xl text-white font-bold text-base cursor-pointer active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
                boxShadow: '0 8px 24px rgba(30,111,240,0.35)',
              }}
            >
              العودة للدرس ←
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #0D4FB5 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
            <span className="text-white/80 text-xs font-semibold">🏆 +{score * 10}</span>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center cursor-pointer"
          >
            <span className="text-white font-bold">×</span>
          </button>
        </div>

        <h1 className="text-xl font-black text-white text-right mb-3">اختبر نفسك 🧠</h1>

        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm font-medium">{questions.length}</span>
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-white font-bold text-sm">السؤال {current + 1}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <p className="text-slate-900 font-black text-lg text-right leading-relaxed">{q.question}</p>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {q.options.map((option, idx) => {
            let btnStyle: React.CSSProperties = {
              background: 'white',
              border: '1.5px solid #F1F5F9',
            };
            let textColor = '#0F172A';

            if (answered) {
              if (idx === q.correct) {
                btnStyle = { background: '#F0FDF4', border: '1.5px solid #6EE7B7' };
                textColor = '#065F46';
              } else if (idx === selected && selected !== q.correct) {
                btnStyle = { background: '#FFF5F5', border: '1.5px solid #FCA5A5' };
                textColor = '#991B1B';
              }
            }

            return (
              <button
                key={idx}
                disabled={answered}
                onClick={() => handleAnswer(idx)}
                className="w-full py-4 px-5 rounded-2xl text-right font-bold text-base flex items-center justify-between transition-all cursor-pointer disabled:cursor-default"
                style={btnStyle}
              >
                <span style={{ color: textColor }}>
                  {answered && idx === q.correct ? '✓' : answered && idx === selected ? '✗' : ''}
                </span>
                <span style={{ color: textColor }}>{option}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className="rounded-2xl p-4 mb-4 transition-all"
            style={{
              background: isCorrect ? '#F0FDF4' : '#FFF7ED',
              border: `1.5px solid ${isCorrect ? '#6EE7B7' : '#FDE68A'}`,
            }}
          >
            <div className="font-black text-base mb-1" style={{ color: isCorrect ? '#065F46' : '#92400E' }}>
              {isCorrect ? 'إجابة صحيحة! ✓' : 'إجابة خاطئة 🤔'}
            </div>
            <p className="text-sm font-medium text-right" style={{ color: isCorrect ? '#065F46' : '#92400E' }}>
              {q.explanation}
            </p>
          </div>
        )}

        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
              boxShadow: '0 8px 24px rgba(30,111,240,0.4)',
            }}
          >
            {current < questions.length - 1 ? 'السؤال التالي →' : 'شوف النتيجة 🎯'}
          </button>
        )}
      </div>
    </div>
  );
}