import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { sampleLessons } from '../data/sampleLessons';

export default function PublicLandingScreen() {
  return (
    <div dir="rtl" className="h-full overflow-y-auto bg-[#F5F8FF] text-right text-slate-800">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link to="/" className="text-xl font-black text-blue-800">فهمتها</Link>
          <nav aria-label="القائمة الرئيسية" className="flex items-center gap-2 sm:gap-3">
            <Link to="/articles" className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 sm:inline-block">المقالات</Link>
            <Link to="/auth?mode=signin" className="rounded-xl px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">تسجيل الدخول</Link>
            <Link to="/auth?mode=signup" className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-800">إنشاء حساب</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-bl from-blue-950 via-blue-800 to-indigo-700 px-4 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="font-bold text-blue-200">منصة فهمتها التعليمية</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">افهم الدرس، راجع ملخصه، واختبر نفسك</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              استكشف نماذج دروس تعليمية ومقالات تساعدك على المذاكرة. تقدر تبدأ كزائر، وإنشاء الحساب يساعدك على حفظ تقدمك ونتائجك.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#sample-lessons" className="rounded-xl bg-white px-5 py-3 font-black text-blue-800 hover:bg-blue-50">استكشف الدروس</a>
              <Link to="/articles" className="rounded-xl border border-white/40 px-5 py-3 font-bold text-white hover:bg-white/10">اقرأ المقالات</Link>
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
            {sampleLessons.map((lesson, index) => (
              <article key={lesson.id} className="flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-800">{index + 1}</span>
                <p className="mt-4 text-xs font-black text-blue-700">{lesson.stage} · {lesson.subject}</p>
                <h3 className="mt-2 text-xl font-black leading-8 text-slate-900">{lesson.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{lesson.introduction}</p>
                <Link to={`/demo/${lesson.id}`} className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800">افتح الدرس ←</Link>
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
            <Link to="/articles" className="rounded-xl border border-blue-200 px-5 py-3 font-black text-blue-800 hover:bg-blue-50">كل المقالات ←</Link>
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
