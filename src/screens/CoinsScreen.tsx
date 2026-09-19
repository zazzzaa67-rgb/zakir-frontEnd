import { useNavigate } from 'react-router-dom';

const earnMethods = [
  { icon: '📺', label: 'مشاهدة إعلان', reward: '+5 Coins', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: '🎯', label: 'إكمال تحدي', reward: '+10 Coins', color: '#10B981', bg: '#F0FDF4' },
  { icon: '🔥', label: 'Daily Reward', reward: '+5 Coins', color: '#F97316', bg: '#FFF7ED' },
  { icon: '🏆', label: 'مشاركة الأصدقاء', reward: '+20 Coins', color: '#F59E0B', bg: '#FFFBEB' },
];

const recentTransactions = [
  { type: 'earn', label: 'Daily Reward', amount: '+5', date: 'اليوم' },
  { type: 'spend', label: 'فتح درس: الدوال', amount: '-15', date: 'أمس' },
  { type: 'earn', label: 'مشاهدة إعلان', amount: '+5', date: 'أمس' },
  { type: 'earn', label: 'إكمال تحدي', amount: '+10', date: 'منذ يومين' },
  { type: 'spend', label: 'فتح درس: المتباينات', amount: '-15', date: 'منذ 3 أيام' },
];

export default function CoinsScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #78350F 0%, #92400E 40%, #D97706 100%)' }}
      >
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(-30%, -30%)' }} />

        <div className="flex items-center justify-between mb-4">
          <div className="px-3 py-1.5 rounded-xl bg-amber-900/30 text-amber-100 text-xs font-semibold">
            مختلف عن Points 🏆
          </div>
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold">→</span>
          </button>
        </div>

        <div className="flex items-center gap-4 justify-end mb-3">
          <div className="text-right">
            <div className="text-amber-200/70 text-sm font-medium">رصيدك الحالي</div>
            <div className="text-white text-5xl font-black">85</div>
            <div className="text-amber-200 text-base font-bold">Coins 🪙</div>
          </div>
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          >
            🪙
          </div>
        </div>

        <div
          className="rounded-2xl p-3 mt-2"
          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <p className="text-amber-100 text-xs font-semibold text-right leading-relaxed">
            🪙 الـ Coins بتستخدمها لفتح دروس إضافية — مختلفة تماماً عن الـ Points 🏆 اللي بتمثل مستواك
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Unlock lesson CTA */}
        <div
          className="rounded-2xl p-4 mb-4 flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1.5px solid #F59E0B',
          }}
        >
          <div className="flex-1 text-right">
            <div className="font-black text-amber-900 text-base mb-0.5">فتح درس إضافي</div>
            <div className="text-amber-700 text-xs font-medium">كل درس إضافي = 15 Coins</div>
          </div>
          <button
            onClick={() => navigate('/subjects')}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-white font-bold text-sm active:scale-95 transition-transform cursor-pointer"
            style={{ background: '#F59E0B', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}
          >
            افتح درس
          </button>
        </div>

        {/* Ways to earn */}
        <h2 className="text-slate-900 text-lg font-black mb-3 text-right">اكسب Coins</h2>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {earnMethods.map((method) => (
            <button
              key={method.label}
              className="rounded-2xl p-4 text-right active:scale-95 transition-transform cursor-pointer"
              style={{
                background: method.bg,
                border: `1.5px solid ${method.color}22`,
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 mr-auto"
                style={{ background: method.color + '22' }}
              >
                {method.icon}
              </div>
              <div className="font-black text-slate-800 text-sm mb-0.5">{method.label}</div>
              <div className="font-black text-sm" style={{ color: method.color }}>{method.reward}</div>
            </button>
          ))}
        </div>

        {/* Recent transactions */}
        <h2 className="text-slate-900 text-lg font-black mb-3 text-right">سجل المعاملات</h2>
        <div className="flex flex-col gap-2.5">
          {recentTransactions.map((tx, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <span
                className="text-base font-black"
                style={{ color: tx.type === 'earn' ? '#10B981' : '#EF4444' }}
              >
                {tx.amount} 🪙
              </span>
              <div className="flex-1 text-right">
                <div className="font-bold text-slate-800 text-sm">{tx.label}</div>
                <div className="text-xs text-slate-400 font-medium">{tx.date}</div>
              </div>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: tx.type === 'earn' ? '#F0FDF4' : '#FFF5F5' }}
              >
                {tx.type === 'earn' ? '↑' : '↓'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}