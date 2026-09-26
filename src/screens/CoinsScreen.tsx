import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { buyGem, getStoredProfile, updateStoredProfile } from '../lib/api';

export default function CoinsScreen() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');
  const [gemNotice, setGemNotice] = useState('');
  const [buyingGem, setBuyingGem] = useState(false);
  const [gems, setGems] = useState(Number(getStoredProfile()?.gems ?? 0));
  const [coins, setCoins] = useState(Number(getStoredProfile()?.coins ?? 0));
  const rewardedAdUnit = import.meta.env.VITE_GOOGLE_AD_MANAGER_REWARDED_UNIT;

  async function handleBuyGem() {
    setGemNotice('');
    setBuyingGem(true);
    try {
      const result = await buyGem();
      setGems(result.gems);
      setCoins(result.coins);
      updateStoredProfile({ coins: result.coins, gems: result.gems });
      setGemNotice('تم شراء جوهرة بنجاح!');
    } catch (error) {
      setGemNotice(error instanceof Error ? error.message : 'تعذر شراء الجوهرة. حاول مرة تانية.');
    } finally {
      setBuyingGem(false);
    }
  }

  return (
    <div dir="rtl" className="flex h-full flex-col bg-[#F0F4FF] text-right">
      <header className="bg-gradient-to-l from-amber-700 to-amber-500 px-5 pb-6 pt-10 text-white">
        <button onClick={() => navigate('/home')} className="mb-5 rounded-lg bg-white/15 px-3 py-1 text-sm font-bold">العودة للرئيسية</button>
        <p className="text-sm text-white/80">رصيد العملات</p>
        <h1 className="mt-1 text-4xl font-black">{coins} 🪙</h1>
        <p className="mt-2 text-sm text-white/80">استخدم العملات لفتح الدروس الإضافية.</p>
      </header>

      <main className="mx-auto flex-1 w-full overflow-y-auto space-y-4 px-5 py-5 pb-24 md:max-w-4xl">
        <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-violet-950">الجواهر 💎</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">الجواهر دي تقدر تشترك بيها في مسابقات منصة فهمتها يا بطل</p>
          <p className="mt-4 text-2xl font-black text-violet-700">معاك {gems} 💎</p>
          <button
            type="button"
            onClick={handleBuyGem}
            disabled={buyingGem || coins < 20}
            className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {buyingGem ? 'جاري الشراء...' : 'اشتري جوهرة بـ 20 عملة'}
          </button>
          {coins < 20 && <p className="mt-2 text-xs text-slate-500">تحتاج إلى 20 عملة على الأقل لشراء جوهرة.</p>}
          {gemNotice && <p role="status" className="mt-3 text-sm font-semibold text-violet-800">{gemNotice}</p>}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">اكسب عملات بمشاهدة إعلان</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">شاهد إعلانين مكافئين متتاليين بإجراء واحد لتحصل على ١٠ عملات. تُضاف العملات بعد تأكيد اكتمال الإعلانين.</p>
          <button
            type="button"
            disabled={!rewardedAdUnit}
            onClick={() => setNotice('إعلانات المكافآت غير مفعّلة بعد. يلزم إعداد وحدة مكافآت في Google Ad Manager.')}
            className="mt-4 w-full rounded-xl bg-amber-500 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {rewardedAdUnit ? 'شاهد إعلانين واكسب ١٠ عملات' : 'إعلانات المكافآت غير مفعّلة حاليًا'}
          </button>
          {notice && <p role="status" className="mt-3 text-sm font-semibold text-amber-800">{notice}</p>}
          {!rewardedAdUnit && <p className="mt-2 text-xs leading-5 text-slate-500">بعد تجهيز وحدة الإعلانات، أضف مسارها إلى VITE_GOOGLE_AD_MANAGER_REWARDED_UNIT لتفعيل الزر.</p>}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">فتح الدروس</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">الدرس الأول في كل مادة مجاني. فتح كل درس تالٍ يكلف ١٠ عملات، ويشترط إكمال الاختبار لفتح الدرس التالي.</p>
          <button onClick={() => navigate('/subjects')} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white">استعرض المواد والدروس</button>
        </section>
      </main>
      <BottomNav active="coins" />
    </div>
  );
}
