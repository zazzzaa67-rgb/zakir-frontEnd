import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const articles = [
  {
    id: 'productive-study',
    title: 'ذاكر بذكاء: الإنتاجية والتركيز في وقت أقل',
    description: 'خطوات بسيطة لتنظيم وقتك، واختيار طريقة مذاكرة فعالة، ومقاومة المشتتات.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'دفتر وأدوات دراسة على مكتب',
  },
];

export default function ArticlesScreen() {
  const navigate = useNavigate();
  const { articleId } = useParams();

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF] text-right">
      <main className="flex-1 overflow-y-auto pb-24">
        <header className="bg-gradient-to-l from-blue-700 to-indigo-700 px-5 pt-12 pb-7 text-white">
          <button onClick={() => navigate('/home')} className="mb-5 text-sm font-bold text-white/80">العودة للرئيسية ←</button>
          <h1 className="text-2xl font-black">مقالات تساعدك تذاكر</h1>
          <p className="mt-2 text-sm text-white/75">أفكار عملية لتحسين مذاكرتك كل يوم.</p>
        </header>

        {!articleId && <section className="px-5 py-5">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => navigate(`/articles/${article.id}`)}
              className="w-full overflow-hidden rounded-3xl bg-white text-right shadow-sm transition-transform active:scale-[0.99]"
            >
              <img src={article.image} alt={article.imageAlt} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-black text-slate-900">{article.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p>
                <span className="mt-3 inline-block text-sm font-bold text-blue-600">اقرأ المقال ←</span>
              </div>
            </button>
          ))}
        </section>}

        {articles.filter((article) => !articleId || article.id === articleId).map((article) => (
          <article key={article.id} className="mx-5 mb-5 rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">{article.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>المذاكرة الفعالة مش معناها إنك تقعد ساعات طويلة قدام الكتاب؛ الأهم إنك تذاكر بهدف واضح، وتدي انتباهك فرصة يشتغل من غير مقاطعة. ابدأ بتحديد مهمة صغيرة، زي حل خمس مسائل أو مراجعة درس واحد، واكتبها قدامك قبل ما تبدأ.</p>
              <h3 className="text-base font-black text-slate-900">نظّم وقتك على جلسات قصيرة</h3>
              <p>جرّب تذاكر ٢٥ دقيقة بتركيز، وبعدها خد راحة خمس دقايق. في وقت الراحة قوم اتحرك واشرب مياه، وبعد أربع جلسات خد راحة أطول. لو المدة دي مش مناسبة ليك، اختار مدة تقدر تحافظ فيها على تركيزك؛ المهم تبدأ وتلتزم بالخطة.</p>
              <h3 className="text-base font-black text-slate-900">ذاكر بطريقة تخلي المعلومة تثبت</h3>
              <p>بعد ما تقرأ جزء صغير، اقفل الكتاب وحاول تشرح الفكرة من ذاكرتك بكلامك. حل أسئلة، واكتب النقاط اللي نسيتها، وارجع لها بعد فترة ثم راجعها في الأيام التالية. استرجاع المعلومة بنفسك غالبًا أفيد من إعادة القراءة مرات كتير.</p>
              <h3 className="text-base font-black text-slate-900">قلّل المشتتات وارجع بهدوء</h3>
              <p>حط الموبايل بعيد أو فعّل وضع عدم الإزعاج، وجهّز أدواتك قبل الجلسة. لو سرحت، لاحظ ده من غير لوم لنفسك، واكتب الفكرة اللي شغلتك لو محتاجة متابعة، وبعدها ارجع للمهمة. النوم الكافي والماء والحركة الخفيفة بيساعدوا تركيزك كمان.</p>
              <p className="rounded-2xl bg-blue-50 p-4 font-bold text-blue-900">ابدأ النهارده بجلسة واحدة: مهمة واضحة، موبايل بعيد، وخمس دقايق راحة بعد ما تخلص.</p>
            </div>
          </article>
        ))}
      </main>
      <BottomNav active="home" />
    </div>
  );
}
