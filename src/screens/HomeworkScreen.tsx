import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LessonQuestion, submitExamResult, getStoredProfile } from '../lib/api';
import { updateLocalPointsAndCoins, setCachedProfile } from '../lib/profileManager';
import { recordMistake } from '../lib/mistakeStore';

const fallbackHomeworkQuestions = [
  {
    question: 'ما هو حاصل ضرب 7 × 8؟',
    options: ['54', '56', '64', '49'],
    correct: 1,
    explanation: '7 × 8 = 56 ✓',
  },
  {
    question: 'أين تقع الأهرامات الثلاثة؟',
    options: ['القاهرة', 'الجيزة', 'الأقصر', 'الإسكندرية'],
    correct: 1,
    explanation: 'تقع الأهرامات في محافظة الجيزة ✓',
  },
];

interface LocationState {
  questions?: LessonQuestion[];
  lesson?: string;
  lessonId?: string;
  subject?: string;
}

export default function HomeworkScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const lessonQuestions = state.questions;
  const questions = lessonQuestions?.length
    ? lessonQuestions.map((item) => ({
        question: item.question ?? 'سؤال الواجب',
        options: item.options ?? [],
        correct: item.correct_index ?? 0,
        explanation: item.explanation ?? 'راجع شرح الدرس للتحقق من الحل.',
      }))
    : fallbackHomeworkQuestions;

  const lesson = state.lesson || 'الدرس';
  const lessonId = state.lessonId;
  const subject = state.subject || lesson;

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
    } else {
      recordMistake({
        subject,
        lesson,
        question: q.question,
        yourAnswer: q.options[idx] ?? '',
        correct: q.options[q.correct] ?? '',
      });
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResults(true);

      // 1. إضافة 10 نقاط فقط للواجب مع 0 Coins
      const earnedPoints = 10;
      const earnedCoins = 0;

      // 2. تحديث التخزين المحلي فوراً
      updateLocalPointsAndCoins(earnedPoints, earnedCoins);

      // 3. إرسال النتيجة للسيرفر
      const profile = getStoredProfile();
      if (profile) {
        const isPerfectScore = score === questions.length;
        submitExamResult(profile.id, isPerfectScore)
          .then((res) => {
            if (res.profile) {
              setCachedProfile(res.profile);
            }
          })
          .catch((err) => {
            console.error('❌ خطأ أثناء حفظ نتيجة الواجب:', err);
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
          style={{ background: 'linear-gradient(160deg, #F97316 0%, #C2410C 100%)' }}
        >
          <h1 className="text-2xl font-black text-white text-right mb-1">نتيجة الواجب 📝</h1>
          <p className="text-orange-100 text-sm font-medium text-right">{lesson}</p>
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
              className="text-2xl font-black mb-1 flex items-center gap-2 justify-center"
              style={{
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <span>+10 Points 🏆</span>
            </div>
            <p className="text-slate-600 font-medium">
              {percentage >= 80 ? 'عاش جداً! أنهيت الواجب بنجاح 🌟' : 'أداء جيد! استمر في المذاكرة 💪'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/mistakes')}
              className="w-full rounded-2xl bg-red-50 py-3 font-bold text-red-700"
            >
              مراجعة أخطائي
            </button>
            <button
              onClick={() => navigate('/ai-lesson', { state: { lesson, lessonId } })}
              className="w-full py-4 rounded-2xl text-white font-bold text-base cursor-pointer active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #F97316, #C2410C)',
                boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
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
        style={{ background: 'linear-gradient(160deg, #F97316 0%, #C2410C 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
            <span className="text-white/80 text-xs font-semibold">🏆 +10 Points</span>
          </div>
          <button
            onClick={() => navigate('/ai-lesson', { state: { lesson, lessonId } })}
            className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center cursor-pointer"
          >
            <span className="text-white font-bold">×</span>
          </button>
        </div>

        <h1 className="text-xl font-black text-white text-right mb-3">واجب الدرس 📝</h1>

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
              background: 'linear-gradient(135deg, #F97316, #C2410C)',
              boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
            }}
          >
            {current < questions.length - 1 ? 'السؤال التالي →' : 'شوف النتيجة 🎯'}
          </button>
        )}
      </div>
    </div>
  );
}
