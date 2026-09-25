import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { getLeaderboard, getTeam } from '../lib/api';
// 1. استيراد getCachedProfile بدلاً من getStoredProfile (تأكد من المسار الصحيح للملف)
import { getCachedProfile } from '../lib/profileManager'; 

const quickActions = [
  { icon: '📚', label: 'المواد', path: '/subjects', color: '#EFF6FF', iconBg: '#1E6FF0' },
  { icon: '🤖', label: 'ذاكر معي', path: '/ai-lesson', color: '#F5F3FF', iconBg: '#7C3AED' },
  { icon: '📖', label: 'مقالات', path: '/articles', color: '#FFF7ED', iconBg: '#F97316' },
  { icon: '📊', label: 'تقدمي', path: '/gamification', color: '#F0FDF4', iconBg: '#10B981' },
  { icon: '📅', label: 'جدول المذاكرة', path: '/planner', color: '#FFF5F5', iconBg: '#EF4444' },
  { icon: '❌', label: 'أخطائي', path: '/mistakes', color: '#FEFCE8', iconBg: '#EAB308' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // 2. دالة جلب البروفايل المحلي والتأكد من قراءته
    const loadProfile = () => {
      const currentProfile = getCachedProfile();
      setProfile(currentProfile);
    };

    // تحميل البروفايل فور فتح الشاشة
    loadProfile();

    // الاستماع لحدث profileUpdated للتحديث الفوري للنقاط والـ coins عند أي تغيير
    window.addEventListener('profileUpdated', loadProfile);

    // جلب بيانات الفرق والـ Leaderboard
    Promise.all([getTeam(), getLeaderboard()])
      .then(([teamResult, leaderboardResult]) => {
        setTeam(teamResult?.team);
        setLeaderboard(leaderboardResult?.teams?.slice(0, 3) || []);
      })
      .catch(() => {
        setLeaderboard([]);
      });

    // تنظيف الـ EventListener عند إغلاق الشاشة
    return () => {
      window.removeEventListener('profileUpdated', loadProfile);
    };
  }, []);

  // 3. دعم مسميات الاسم المختلفة (display_name أو name أو full_name)
  const rawName = profile?.display_name || profile?.name || profile?.full_name || '';
  const firstName = rawName ? rawName.split(' ')[0] : 'يا بطل';

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF] text-right">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Header */}
        <div
          className="px-5 pt-12 pb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #0D4FB5 100%)' }}
        >
          {/* decoration */}
          <div
            className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'white', transform: 'translate(-30%, -30%)' }}
          />
          <div
            className="absolute bottom-0 right-8 w-24 h-24 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'white', transform: 'translate(0, 50%)' }}
          />

          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-xl">🔔</span>
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-white/70 text-sm font-medium">جاهز نذاكر النهارده؟</p>
                <h1 className="text-white text-xl font-black">أهلاً {firstName} 👋</h1>
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
              <div className="text-white/60 text-xs mt-1 font-medium">
                Level {Math.floor((profile?.points ?? 0) / 100) + 1} • مستواك
              </div>
            </div>

            {/* Coins card */}
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
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'white', transform: 'translate(30%, -30%)' }}
            />

            <div className="flex items-start justify-between mb-4">
              <button
                onClick={() => navigate('/ai-lesson')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer active:scale-95 transition-transform"
                style={{ background: '#1E6FF0', color: 'white', boxShadow: '0 4px 12px rgba(30,111,240,0.5)' }}
              >
                <span>ابدأ المذاكرة</span>
                <span>▶️</span>
              </button>
              <div>
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
              <div>
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
            <div className="flex-1">
              <div className="text-lg font-black text-orange-800">7 أيام متتالية</div>
              <div className="text-orange-600/70 text-sm font-medium mt-0.5">كمّل النهارده عشان تحافظ على الـ Streak!</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate('/subjects')} className="text-blue-600 text-sm font-bold cursor-pointer">
              عرض الكل
            </button>
            <h2 className="text-slate-900 text-lg font-black">الأدوات السريعة</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
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

        {/* Teams */}
        <div className="px-5 mt-5">
          <div
            className="rounded-3xl p-5"
            style={{
              background: 'linear-gradient(135deg, #0B1A34 0%, #164E63 100%)',
              boxShadow: '0 8px 24px rgba(11,26,52,0.2)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <button
                onClick={() => navigate('/teams')}
                className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-[#0B1A34] cursor-pointer active:scale-95 transition-transform"
              >
                {team ? 'فتح الفرقة' : 'اعمل فرقتك'}
              </button>
              <div>
                <p className="text-xs font-bold text-cyan-200">مذاكرة جماعية</p>
                <h2 className="mt-1 text-xl font-black text-white">الفرق وترتيب المنافسة</h2>
                <p className="mt-1 text-xs text-white/60">نافسوا بالنقاط وذاكروا معًا</p>
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3">
              {leaderboard.length > 0 ? (
                leaderboard.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => navigate('/teams')}
                    className="flex w-full items-center gap-3 border-b border-white/10 py-2 last:border-0 cursor-pointer active:opacity-80"
                  >
                    <strong className="w-5 text-center text-sm text-cyan-200">{index + 1}</strong>
                    <span className="flex-1 text-right text-sm font-bold text-white">{item.name}</span>
                    <span className="text-xs font-black text-amber-300">{item.totalPoints?.toLocaleString()} نقطة</span>
                  </button>
                ))
              ) : (
                <p className="py-2 text-center text-sm font-medium text-white/60">كن أول فريق في الترتيب</p>
              )}
            </div>
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
                onClick={() => navigate('/lessons')}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-98 transition-transform"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: item.color + '18' }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
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
      <Footer />
      <BottomNav active="home" />
    </div>
  );
}
