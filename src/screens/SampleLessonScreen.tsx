import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sampleLessons } from '../data/sampleLessons';

type LessonTab = 'lesson' | 'summary' | 'homework' | 'quiz';

const tabs: Array<{ id: LessonTab; label: string }> = [
  { id: 'lesson', label: 'الدرس' },
  { id: 'summary', label: 'الملخص' },
  { id: 'homework', label: 'الواجب' },
  { id: 'quiz', label: 'الاختبار' },
];

export default function SampleLessonScreen() {
  const { lessonId } = useParams();
  const lesson = sampleLessons.find((item) => item.id === lessonId);
  const [tab, setTab] = useState<LessonTab>('lesson');
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!lesson) {
    return (
      <main dir="rtl" className="flex h-full flex-col items-center justify-center bg-[#F5F8FF] px-5 text-center">
        <h1 className="text-2xl font-black text-slate-900">الدرس غير موجود</h1>
        <p className="mt-2 text-slate-600">اختار درسًا من قائمة النماذج المتاحة.</p>
        <Link to="/" className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">العودة للدروس</Link>
      </main>
    );
  }

  function submitQuiz() {
    if (answers.length !== lesson.quiz.length) return;
    setSubmitted(true);
  }

  const score = lesson.quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  const answeredCount = answers.filter((answer) => typeof answer === 'number').length;

  return (
    <div dir="rtl" className="h-full overflow-y-auto bg-[#F5F8FF] text-right text-slate-800">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <Link to="/" className="font-black text-blue-800">فهمتها</Link>
          <Link to="/auth?mode=signin" className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-50">تسجيل الدخول</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
        <Link to="/" className="text-sm font-bold text-blue-700 hover:text-blue-900">← كل الدروس النموذجية</Link>
        <div className="mt-4 rounded-3xl bg-gradient-to-bl from-blue-950 to-blue-700 p-6 text-white sm:p-8">
          <p className="text-sm font-bold text-blue-200">{lesson.stage} · {lesson.subject}</p>
          <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{lesson.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">{lesson.introduction}</p>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2">
          {tabs.map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`shrink-0 rounded-xl px-4 py-3 text-sm font-black transition ${tab === item.id ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-blue-50'}`}>
              {item.label}
            </button>
          ))}
        </div>

        <section className="my-5 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          {tab === 'lesson' && (
            <div className="space-y-7">
              {lesson.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-black text-slate-900">{section.heading}</h2>
                  <div className="mt-2 space-y-3 text-base leading-8 text-slate-700">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
              <button type="button" onClick={() => setTab('summary')} className="rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800">انتقل إلى الملخص ←</button>
            </div>
          )}

          {tab === 'summary' && (
            <div>
              <h2 className="text-xl font-black text-slate-900">ملخص الدرس</h2>
              <ul className="mt-4 space-y-3">
                {lesson.summary.map((point) => <li key={point} className="flex gap-3 rounded-2xl bg-blue-50 p-4 text-base leading-7 text-slate-700"><span className="font-black text-blue-700">•</span><span>{point}</span></li>)}
              </ul>
              <button type="button" onClick={() => setTab('homework')} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800">شاهد الواجب ←</button>
            </div>
          )}

          {tab === 'homework' && (
            <div>
              <h2 className="text-xl font-black text-slate-900">تدريبات على الدرس</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">حاول الحل بنفسك أولًا، ثم افتح «إجابة مقترحة» للمراجعة.</p>
              <ol className="mt-5 space-y-4">
                {lesson.homework.map((item, index) => (
                  <li key={item.question} className="rounded-2xl border border-slate-100 p-4">
                    <p className="font-bold leading-7 text-slate-800">{index + 1}. {item.question}</p>
                    <details className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700">
                      <summary className="cursor-pointer font-bold text-blue-700">إجابة مقترحة</summary>
                      <p className="mt-2">{item.answer}</p>
                    </details>
                  </li>
                ))}
              </ol>
              <button type="button" onClick={() => setTab('quiz')} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800">ابدأ الاختبار القصير ←</button>
            </div>
          )}

          {tab === 'quiz' && (
            <div>
              <h2 className="text-xl font-black text-slate-900">اختبر فهمك</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">جاوب عن الأسئلة كلها ثم أرسل إجاباتك. النتيجة والتصحيح متاحان للزائر.</p>
              <div className="mt-5 space-y-6">
                {lesson.quiz.map((question, questionIndex) => (
                  <fieldset key={question.question} className="rounded-2xl border border-slate-100 p-4">
                    <legend className="px-1 font-black leading-7 text-slate-900">{questionIndex + 1}. {question.question}</legend>
                    <div className="mt-2 space-y-2">
                      {question.choices.map((choice, choiceIndex) => {
                        const selected = answers[questionIndex] === choiceIndex;
                        const isCorrect = submitted && question.answer === choiceIndex;
                        const isWrongAnswer = submitted && selected && !isCorrect;
                        return (
                          <label key={choice} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm leading-6 ${isCorrect ? 'border-emerald-300 bg-emerald-50' : isWrongAnswer ? 'border-red-300 bg-red-50' : selected ? 'border-blue-300 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <input type="radio" name={`question-${questionIndex}`} checked={selected} disabled={submitted} onChange={() => setAnswers((current) => { const next = [...current]; next[questionIndex] = choiceIndex; return next; })} />
                            <span>{choice}</span>
                          </label>
                        );
                      })}
                    </div>
                    {submitted && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700">{question.explanation}</p>}
                  </fieldset>
                ))}
              </div>

              {!submitted ? (
                <div className="mt-6">
                  <button type="button" disabled={answeredCount !== lesson.quiz.length} onClick={submitQuiz} className="rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">إرسال الإجابات وعرض النتيجة</button>
                  {answeredCount !== lesson.quiz.length && <p className="mt-2 text-sm text-slate-500">أجب عن كل الأسئلة قبل الإرسال.</p>}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <h3 className="text-lg font-black text-slate-900">نتيجتك: {score} من {lesson.quiz.length}</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-700">راجع التوضيحات، ثم ارجع إلى النقاط التي تحتاج إلى تدريب إضافي.</p>
                  <Link to="/auth?mode=signup" className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800">أنشئ حسابًا لحفظ تقدمك</Link>
                </div>
              )}
            </div>
          )}
        </section>

        <div className="mb-8 text-center">
          <Link to="/articles" className="font-bold text-blue-700 hover:text-blue-900">أو اقرأ مقالات تساعدك على المذاكرة ←</Link>
        </div>
      </main>
    </div>
  );
}
