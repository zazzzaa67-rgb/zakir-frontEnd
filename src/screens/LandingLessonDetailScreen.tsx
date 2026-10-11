import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { landingLessonDetails } from '../data/landingLessonData';

type LessonAction = 'homework' | 'exam';

export default function LandingLessonDetailScreen() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = landingLessonDetails.find((item) => item.id === lessonId);
  const [action, setAction] = useState<LessonAction>('homework');
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!lesson) {
    return (
      <main dir="rtl" className="flex min-h-screen flex-col items-center justify-center bg-[#F5F8FF] px-5 text-center">
        <h1 className="text-2xl font-black text-slate-900">الدرس غير موجود</h1>
        <Link to="/#sample-lessons" className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">العودة للدروس</Link>
      </main>
    );
  }

  const content = lesson.content_json;
  const questions = action === 'homework'
    ? content.homework?.length ? content.homework : content.quiz ?? []
    : content.exam?.length ? content.exam : content.quiz ?? [];
  const score = questions.reduce((sum, question, index) => sum + (answers[index] === question.correct_index ? 1 : 0), 0);

  function chooseAction(next: LessonAction) {
    setAction(next);
    setAnswers([]);
    setSubmitted(false);
  }

  return (
    <div dir="rtl" className="min-h-screen overflow-y-auto bg-[#F5F8FF] text-right text-slate-800">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
        <Link to="/#sample-lessons" className="mb-4 inline-flex font-bold text-blue-700 hover:text-blue-900">Back to lessons</Link>
        <div className="rounded-3xl bg-gradient-to-bl from-blue-950 to-blue-700 p-6 text-white sm:p-8">
          <p className="text-sm font-bold text-blue-200">الصف {lesson.grade_level} الثانوي · {lesson.subject_title}</p>
          <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{lesson.lesson_title}</h1>
          <p className="mt-3 text-sm leading-7 text-blue-100">{lesson.unit_title || lesson.book_title}</p>
        </div>

        <section className="my-5 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-black text-slate-900">شرح الدرس</h2>
          <div className="mt-3 whitespace-pre-line text-base leading-8 text-slate-700">
            {content.detailed_explanation || content.summary || 'لا يتوفر شرح لهذا الدرس.'}
          </div>
          {content.key_points?.length ? (
            <ul className="mt-5 space-y-2">
              {content.key_points.map((point, index) => <li key={`${index}-${point}`} className="rounded-xl bg-blue-50 p-3 leading-7">{point}</li>)}
            </ul>
          ) : null}
          {content.summary && content.detailed_explanation ? (
            <details className="mt-5 rounded-xl bg-slate-50 p-4">
              <summary className="cursor-pointer font-black text-blue-700">ملخص الدرس</summary>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{content.summary}</p>
            </details>
          ) : null}
        </section>

        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-white p-2 sm:gap-3">
          {lesson.pdf_url ? (
            <a href={lesson.pdf_url} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-3 text-center text-sm font-black text-white hover:bg-blue-800">
              <span aria-hidden="true">📄</span><span>ملف PDF</span>
            </a>
          ) : (
            <button disabled className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-slate-200 px-3 py-3 text-sm font-black text-slate-500">📄 ملف PDF غير متاح</button>
          )}
          <button type="button" onClick={() => chooseAction('homework')} className={`flex min-h-14 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-black ${action === 'homework' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'}`}>
            <span aria-hidden="true">📝</span><span>الواجب</span>
          </button>
          <button type="button" onClick={() => chooseAction('exam')} className={`flex min-h-14 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-black ${action === 'exam' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'}`}>
            <span aria-hidden="true">🧠</span><span>الامتحان</span>
          </button>
        </div>

        <section className="my-5 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-black text-slate-900">{action === 'homework' ? 'واجب الدرس' : 'امتحان الدرس'}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">جاوب عن الأسئلة، وبعد الإرسال هتظهر الإجابات الصحيحة والشرح الموجود في الدرس.</p>
          {questions.length === 0 ? (
            <p className="mt-5 rounded-xl bg-amber-50 p-4 font-bold text-amber-800">لا توجد أسئلة متاحة حاليًا.</p>
          ) : (
            <>
              <div className="mt-5 space-y-5">
                {questions.map((question, questionIndex) => (
                  <fieldset key={`${questionIndex}-${question.question}`} className="rounded-2xl border border-slate-100 p-4">
                    <legend className="px-1 font-black leading-7 text-slate-900">{questionIndex + 1}. {question.question}</legend>
                    <div className="mt-2 space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const selected = answers[questionIndex] === optionIndex;
                        const correct = submitted && question.correct_index === optionIndex;
                        const incorrect = submitted && selected && !correct;
                        return (
                          <label key={`${optionIndex}-${option}`} className={`flex items-center gap-3 rounded-xl border p-3 text-sm leading-6 ${correct ? 'border-emerald-300 bg-emerald-50' : incorrect ? 'border-red-300 bg-red-50' : selected ? 'border-blue-300 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <input type="radio" name={`landing-${lesson.id}-${action}-${questionIndex}`} checked={selected} disabled={submitted} onChange={() => setAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} />
                            <span>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                    {submitted && question.explanation && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700">{question.explanation}</p>}
                  </fieldset>
                ))}
              </div>
              {!submitted ? (
                <button type="button" disabled={!questions.every((_, index) => typeof answers[index] === 'number')} onClick={() => setSubmitted(true)} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">إرسال الإجابات وعرض النتيجة</button>
              ) : (
                <p className="mt-5 rounded-2xl bg-blue-50 p-4 font-black text-blue-900">نتيجتك: {score} من {questions.length}</p>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
