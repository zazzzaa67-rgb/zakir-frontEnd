import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import ahmedPhoto from '../assets/ahmed-mohamed.jpg';

const values = [
  {
    icon: '📚',
    title: 'تعليم متاح للجميع',
    description: 'نجعل الوصول إلى الشروحات والموارد التعليمية أسهل، لتتعلم في الوقت والمكان المناسبين لك.',
  },
  {
    icon: '🎮',
    title: 'تعلّم ممتع ومحفّز',
    description: 'نحوّل التقدم الدراسي إلى رحلة تفاعلية عبر التحديات والنقاط والمكافآت التي تشجعك على الاستمرار.',
  },
  {
    icon: '⚡',
    title: 'تغذية راجعة فورية',
    description: 'تساعدك الاختبارات القصيرة على معرفة إجاباتك ومواطن القوة والجوانب التي تحتاج إلى مزيد من التركيز.',
  },
];

export default function AboutUs() {
  return (
    <div dir="rtl" className="flex h-full flex-col bg-[#F0F4FF] text-right text-slate-800">
      <main className="flex-1 overflow-y-auto pb-24">
        <header className="relative overflow-hidden bg-gradient-to-l from-blue-700 to-indigo-700 px-5 pb-10 pt-10 text-white sm:px-8">
          <div className="pointer-events-none absolute -left-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-semibold text-white/75">فهمتها</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">من نحن</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              فهمتها منصة تعليمية مبتكرة تهدف إلى تمكين الطلاب ومساعدتهم على تحقيق تقدم حقيقي في دراستهم،
              من خلال دروس تفاعلية واختبارات قصيرة ونظام للتحفيز والمكافآت يجعل التعلّم أقرب إلى اهتماماتهم.
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900">ما الذي يميّز تجربتنا؟</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">نصمم تجربة تساعدك على الفهم، والتفاعل، وملاحظة تقدمك خطوة بخطوة.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {values.map(({ icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  {icon}
                </span>
                <h3 className="mt-4 font-black text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-8">
          <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
            <div className="grid sm:grid-cols-[220px_1fr]">
              <img
                src={ahmedPhoto}
                alt="Ahmed Mohamed، مؤسس Forixa"
                className="h-72 w-full object-cover object-[center_32%] sm:h-full sm:min-h-72"
                loading="eager"
                decoding="async"
              />
              <div className="p-6 sm:p-8">
                <p className="text-sm font-black text-blue-700">الجهة المؤسسة للمنصة</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Forixa</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Forixa هي الجهة المؤسسة لمنصة فهمتها. أسسها Ahmed Mohamed، ويعمل على تطوير تجارب رقمية تساعد الطلاب على التعلّم.
                </p>
                <p className="mt-5 font-black text-slate-900">Ahmed Mohamed</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/ahmed-mohamed-b657163a6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#004182]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://forixa.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-black text-blue-800 transition hover:bg-blue-50"
                  >
                    زيارة Forixa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
      <BottomNav active="home" />
    </div>
  );
}
