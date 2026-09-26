import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const weekData = [15, 45, 30, 60, 25, 50, 40];
const dayLabels = ['أح', 'اث', 'ث', 'أر', 'خ', 'ج', 'س'];
const maxVal = Math.max(...weekData);

export default function ProDashboardScreen() {
  const navigate = useNavigate()
  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div
          className="px-5 pt-12 pb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #4338CA 100%)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="px-3 py-1 rounded-full text-xs font-black"
              style={{ background: '#F59E0B', color: 'white' }}
            >
              PRO 🚀
            </div>
            <button onClick={() => navigate('home')} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <span className="text-white font-bold">→</span>
            </button>
          </div>
          <h1 className="text-2xl font-black text-white text-right mb-1">إحصائياتي المتقدمة</h1>
          <p className="text-indigo-300 text-sm font-medium text-right">هذا الأسبوع</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 px-5 mt-4 md:grid-cols-4">
          {[
            { label: 'وقت المذاكرة', value: '4.5 ساعة', icon: '⏱️', color: '#1E6FF0', bg: '#EFF6FF' },
            { label: 'دروس مكتملة', value: '12 درس', icon: '📚', color: '#10B981', bg: '#F0FDF4' },
            { label: 'متوسط الكويزات', value: '82%', icon: '📊', color: '#7C3AED', bg: '#F5F3FF' },
            { label: 'Points مكتسبة', value: '+420', icon: '🏆', color: '#F59E0B', bg: '#FFFBEB' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 mr-auto"
                style={{ background: stat.bg }}
              >
                {stat.icon}
              </div>
              <div className="font-black text-slate-900 text-xl text-right mb-0.5">{stat.value}</div>
              <div className="text-slate-500 text-xs font-medium text-right">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div className="px-5 mt-4">
          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-black text-slate-900 text-base mb-4 text-right">وقت المذاكرة اليومي</h3>
            <div className="flex items-end gap-2 h-24">
              {weekData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${(val / maxVal) * 80}px`,
                      background: i === 5
                        ? 'linear-gradient(180deg, #1E6FF0, #7C3AED)'
                        : 'linear-gradient(180deg, #DBEAFE, #EFF6FF)',
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-400">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streak card */}
        <div className="px-5 mt-4">
          <div
            className="bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            <div className="text-right flex-1">
              <div className="font-black text-slate-900 text-base">الـ Streak الحالي</div>
              <div className="text-slate-500 text-sm font-medium mt-0.5">كمّل ما توقفتش!</div>
            </div>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #F97316, #EF4444)',
                boxShadow: '0 4px 16px rgba(249,115,22,0.4)',
              }}
            >
              <div className="text-center">
                <div className="text-white text-2xl font-black leading-none">7</div>
                <div className="text-orange-100 text-[10px] font-bold">يوم 🔥</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject analysis */}
        <div className="px-5 mt-4">
          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-black text-slate-900 text-base mb-4 text-right">تحليل المواد</h3>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-600">قوي</span>
                <span className="text-sm font-black text-slate-700">📐 رياضيات</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-600">قوي</span>
                <span className="text-sm font-black text-slate-700">🌍 دراسات</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-orange-500">يحتاج تطوير</span>
                <span className="text-sm font-black text-slate-700">🧪 كيمياء</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-orange-500">يحتاج تطوير</span>
                <span className="text-sm font-black text-slate-700">⚛️ فيزياء</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="px-5 mt-4 mb-2">
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0D2356, #1E6FF0)',
              boxShadow: '0 4px 20px rgba(30,111,240,0.3)',
            }}
          >
            <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-10"
              style={{ background: 'white', transform: 'translate(30%, 30%)' }} />

            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-white font-black text-base">AI Study Insight 🤖</span>
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                🤖
              </div>
            </div>
            <p className="text-blue-100 text-sm font-semibold text-right leading-relaxed">
              "أداؤك في الرياضيات اتحسن 18% الأسبوع ده 👏 — لكن الكيمياء محتاج اهتمام أكتر. أنصحك تخصص 30 دقيقة إضافية ليها كل يوم."
            </p>
          </div>
        </div>
      </div>

      <BottomNav active="gamification" />
    </div>
  );
}
