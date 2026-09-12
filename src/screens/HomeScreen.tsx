import { NavProps } from '../App';
import BottomNav from '../components/BottomNav';
import { getStoredProfile } from '../lib/api';

const quickActions = [
  { icon: '📚', label: 'المواد', screen: 'subjects' as const, color: '#EFF6FF', iconBg: '#1E6FF0' },
  { icon: '🤖', label: 'ذاكر معي', screen: 'ai_lesson' as const, color: '#F5F3FF', iconBg: '#7C3AED' },
  { icon: '📝', label: 'اختباراتي', screen: 'quiz' as const, color: '#FFF7ED', iconBg: '#F97316' },
  { icon: '📊', label: 'تقدمي', screen: 'gamification' as const, color: '#F0FDF4', iconBg: '#10B981' },
  { icon: '📅', label: 'جدول المذاكرة', screen: 'planner' as const, color: '#FFF5F5', iconBg: '#EF4444' },
  { icon: '❌', label: 'أخطائي', screen: 'mistakes' as const, color: '#FEFCE8', iconBg: '#EAB308' },
];

export default function HomeScreen({ navigate }: NavProps) {
  const profile = getStoredProfile();
  const firstName = profile?.display_name?.split(' ')[0] || 'يا بطل';

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Header */}
        <div
          className="px-5 pt-12 pb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #0D4FB5 100%)' }}
        >
          {/* decoration */}
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(-30%, -30%)' }} />
          <div className="absolute bottom-0 right-8 w-24 h-24 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(0, 50%)' }} />

          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigate('notifications')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative"
            >
              <span className="text-xl">🔔</span>
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white/70 text-sm font-medium">جاهز نذاكر النهارده؟</p>
                <h1 className="text-white text-xl font-black">أهلاً يا {firstName} 👋</h1>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' }}
              >
                👦
              </div>
            </div>
          </div>

          {/* Points & Coins row */}
          <div className="flex gap-3">
            {/* Points card */}
            <div
              className="flex-1 rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🏆</span>
                <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">Points</span>
              </div>
              <div className="text-3xl font-black text-white leading-none">{profile?.points ?? 0}</div>
              <div className="text-white/60 text-xs mt-1 font-medium">Level 12 • مستواك</div>
            </div>

            {/* Coins card — clearly different: amber/gold */}
            <div
              className="flex-1 rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                border: '1.5px solid rgba(255,255,255,0.3)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🪙</span>
                <span className="text-amber-900/80 text-xs font-semibold tracking-wide uppercase">Coins</span>
              </div>
              <div className="text-3xl font-black text-amber-900 leading-none">{profile?.coins ?? 0}</div>
              <div className="text-amber-900/60 text-xs mt-1 font-medium">افتح بيهم دروس</div>
            </div>
          </div>
        </div>

        {/* Daily Lesson Card */}
        <div className="px-5 mt-5">
          <div
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
              boxShadow: '0 8px 32px rgba(67,56,202,0.35)',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
              style={{ background: 'white', transform: 'translate(30%, -30%)' }} />

            <div className="flex items-start justify-between mb-4">
              <button
                onClick={() => navigate('ai_lesson')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                style={{ background: '#1E6FF0', color: 'white', boxShadow: '0 4px 12px rgba(30,111,240,0.5)' }}
              >
                <span>ابدأ المذاكرة</span>
                <span>▶️</span>
              </button>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className="text-white/60 text-xs font-semibold">درس النهارده</span>
                  <span className="text-lg">🎯</span>
                </div>
                <div className="text-white text-xl font-black">المعادلات الخطية</div>
                <div className="text-indigo-300 text-sm font-medium mt-0.5">📐 رياضيات</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-200 text-xs font-medium">
                <span className="bg-white/10 px-3 py-1.5 rounded-lg">⏱️ 25 دقيقة</span>
                <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1.5 rounded-lg">+30 Points</span>
              </div>
              <div className="text-left">
                <div className="text-white/60 text-xs mb-1 font-medium">تقدم اليوم</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '35%', background: '#10B981' }} />
                  </div>
                  <span className="text-white text-xs font-bold">35%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="px-5 mt-4">
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
              border: '1.5px solid #FDE68A',
              boxShadow: '0 4px 16px rgba(249,115,22,0.12)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)', boxShadow: '0 4px 12px rgba(249,115,22,0.4)' }}
            >
              🔥
            </div>
            <div className="flex-1 text-right">
              <div className="text-lg font-black text-orange-800">7 أيام متتالية</div>
              <div className="text-orange-600/70 text-sm font-medium mt-0.5">كمّل النهارده عشان تحافظ على الـ Streak!</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-600 text-sm font-bold">عرض الكل</span>
            <h2 className="text-slate-900 text-lg font-black">الأدوات السريعة</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.screen)}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                style={{
                  background: action.color,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: action.iconBg + '22' }}
                >
                  {action.icon}
                </div>
                <span className="text-xs font-bold text-slate-700 text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent subjects */}
        <div className="px-5 mt-5 mb-2">
          <h2 className="text-slate-900 text-lg font-black mb-3">استمر من حيث توقفت</h2>
          <div className="flex flex-col gap-3">
            {[
              { icon: '📐', subject: 'الرياضيات', lesson: 'المعادلات الخطية', progress: 68, color: '#1E6FF0' },
              { icon: '🔬', subject: 'العلوم', lesson: 'الحركة والقوة', progress: 42, color: '#10B981' },
            ].map((item) => (
              <button
                key={item.subject}
                onClick={() => navigate('lesson_list')}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 active:scale-98 transition-transform"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: item.color + '18' }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 text-right">
                  <div className="font-black text-slate-900 text-sm">{item.subject}</div>
                  <div className="text-slate-500 text-xs font-medium mt-0.5">{item.lesson}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.progress}%</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.progress}%`, background: item.color }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-slate-300 text-lg">‹</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}
