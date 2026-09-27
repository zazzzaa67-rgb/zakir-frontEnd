import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

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
        <Footer />
      </main>
      <BottomNav active="home" />
    </div>
  );
}
