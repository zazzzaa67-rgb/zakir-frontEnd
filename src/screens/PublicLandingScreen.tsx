import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { getCachedPublicSampleLessons, getPublicSampleLessons, PublicSampleLesson } from '../lib/api';

export default function PublicLandingScreen() {
  const [lessons, setLessons] = useState<PublicSampleLesson[]>(getCachedPublicSampleLessons);
  const [lessonsLoading, setLessonsLoading] = useState(lessons.length === 0);

  useEffect(() => {
    let active = true;
    getPublicSampleLessons()
      .then((result) => { if (active) setLessons(result); })
      .catch(() => { if (active) setLessons([]); })
      .finally(() => { if (active) setLessonsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div dir="rtl" className="h-full overflow-y-auto bg-[#F5F8FF] text-right text-slate-800">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link to="/" className="text-xl font-black text-blue-800">فهمتها</Link>
          <nav aria-label="القائمة الرئيسية" className="flex items-center gap-2 sm:gap-3">
            <Link to="/articles" state={{ returnTo: '/' }} className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 sm:inline-block">المقالات</Link>
            <Link to="/auth?mode=signin" className="rounded-xl px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">تسجيل الدخول</Link>
            <Link to="/auth?mode=signup" className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-800">إنشاء حساب</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="landing-hero relative isolate overflow-hidden bg-gradient-to-bl from-[#071A3D] via-[#123C78] to-[#3155A4] px-4 py-12 text-white sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-sky-300/15 blur-3xl" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="landing-copy">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300" /> منصة فهمتها التعليمية
              </span>
              <h1 className="mt-5 max-w-2xl text-3xl font-black leading-[1.45] sm:text-5xl sm:leading-[1.35]">افهم الدرس، راجع ملخصه، واختبر نفسك</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
                خلي مذاكرتك أوضح وأسهل. استكشف دروسًا تعليمية ومقالات عملية، وابدأ كزائر من غير ما تحتاج إلى تسجيل.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#sample-lessons" className="rounded-xl bg-white px-5 py-3 font-black text-blue-900 shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50">استكشف الدروس</a>
                <Link to="/articles" state={{ returnTo: '/' }} className="rounded-xl border border-white/30 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/15">اقرأ المقالات</Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-blue-100/90">
                <span>✓ تعلّم على خطوتك</span><span>✓ جرّب الدروس مجانًا</span><span>✓ تابع تقدمك</span>
              </div>
            </div>

            <div className="landing-visual relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-sky-300/30 to-indigo-300/10 blur-xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-2xl shadow-blue-950/40 backdrop-blur-sm">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=85" alt="طالب يذاكر ويكتب ملاحظاته" fetchPriority="high" className="h-64 w-full rounded-[1.5rem] object-cover sm:h-80 lg:h-[25rem]" />
                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/90 p-4 text-slate-800 shadow-lg backdrop-blur-md sm:inset-x-7 sm:bottom-7">
                  <div><p className="text-xs font-bold text-blue-700">خطوة صغيرة كل يوم</p><p className="mt-1 font-black">تعلّم، راجع، وتقدّم</p></div>
                  <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-xl text-white">✦</span>
                </div>
              </div>
              <div className="landing-float absolute -right-2 top-7 rounded-2xl border border-white/50 bg-white px-4 py-3 text-slate-800 shadow-xl sm:-right-5 sm:top-10">
                <p className="text-xs font-bold text-slate-500">جاهز تبدأ؟</p><p className="font-black text-blue-800">يلا بينا يا صديقي</p>
              </div>
            </div>
          </div>
        </section>

        <section id="sample-lessons" className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black text-blue-700">ابدأ من هنا</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">نماذج دروس متاحة للجميع</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">كل نموذج يشمل شرحًا وملخصًا وواجبًا واختبارًا قصيرًا يمكنك تجربته من غير تسجيل.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {lessonsLoading && lessons.length === 0 && <p className="col-span-full rounded-2xl bg-white p-6 text-center font-bold text-slate-500">جاري تحميل الدروس...</p>}
            {!lessonsLoading && lessons.length === 0 && <p className="col-span-full rounded-2xl bg-white p-6 text-center font-bold text-slate-500">الدروس غير متاحة حاليًا. حاول مرة أخرى لاحقًا.</p>}
            {lessons.map((lesson) => (
              <article key={lesson.id} className="flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-800">{lesson.grade_level}</span>
                <p className="mt-4 text-xs font-black text-blue-700">الصف {lesson.grade_level} الثانوي · {lesson.subject_title}</p>
                <h3 className="mt-2 text-xl font-black leading-8 text-slate-900">{lesson.lesson_title}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{lesson.unit_title || lesson.book_title}</p>
                <Link to={`/ai-lesson/${lesson.id}`} state={{ publicDemo: true }} className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800">افتح الدرس ←</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-blue-100 bg-white px-4 py-10 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900">تحب تقرأ عن طرق المذاكرة؟</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">تصفح مقالات عن تنظيم المذاكرة والتحفيز والقراءة والتركيز.</p>
            </div>
              <Link to="/articles" state={{ returnTo: '/' }} className="rounded-xl border border-blue-200 px-5 py-3 font-black text-blue-800 hover:bg-blue-50">كل المقالات ←</Link>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-8">
          <div className="mx-auto max-w-6xl rounded-3xl bg-blue-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">احفظ تقدمك وارجع له وقت ما تحب</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">أنشئ حسابًا لمتابعة دروسك ونتائج اختباراتك داخل المنصة.</p>
            </div>
            <Link to="/auth?mode=signup" className="mt-5 inline-block shrink-0 rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800 sm:mt-0">إنشاء حساب مجاني</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
