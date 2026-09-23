import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { StudentProfile } from '../lib/api';
import { getCachedProfile } from '../lib/profileManager';

const menuItems = [
  { icon: '👥', label: 'فرقتي الدراسية', screen: 'teams' as const },
  { icon: '🔔', label: 'الإشعارات', screen: 'notifications' as const, badge: '3' },
  { icon: '🪙', label: 'Coins محفظتي', screen: 'coins' as const },
  { icon: '🏆', label: 'مستواي وإنجازاتي', screen: 'gamification' as const },
  { icon: '🚀', label: 'ذاكر معي PRO', screen: 'pro' as const, highlight: true },
  { icon: '📅', label: 'جدول المذاكرة', screen: 'planner' as const },
  { icon: '📊', label: 'الإحصائيات المتقدمة', screen: 'pro_dashboard' as const },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  
  // 1. قراءة البيانات من LocalStorage بشكل لحظي وآنوي
  const [profile, setProfile] = useState<StudentProfile | null>(() => getCachedProfile());

  useEffect(() => {
    // 2. الاستماع لأي تغيير يحدث في النقاط/البيانات من أي صفحة أخرى
    const handleProfileChange = () => {
      setProfile(getCachedProfile());
    };

    window.addEventListener('profileUpdated', handleProfileChange);
    return () => window.removeEventListener('profileUpdated', handleProfileChange);
  }, []);

  // حساب القيم المباشرة
  const points = profile?.points || 0;
  const coins = profile?.coins || 0;
  const streak = profile?.streak || 0;
  const calculatedLevel = Math.floor(points / 250) + 1;

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile header */}
        <div
          className="px-5 pt-12 pb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #7C3AED 100%)' }}
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(30%, -30%)' }}
          />

          <div className="flex items-center gap-4 justify-end mb-5">
            <div className="text-right">
              <h1 className="text-2xl font-black text-white">
                {profile?.display_name || 'طالب ذاكر معي'}
              </h1>
              <div className="text-blue-200 text-sm font-medium">
                {profile?.grade_level ? `الصف ${profile.grade_level}` : 'المرحلة الدراسية'}
                {profile?.track_id ? ` • ${profile.track_id}` : ''}
              </div>
            </div>
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '3px solid rgba(255,255,255,0.4)',
                }}
              >
                {profile?.gender === 'girl' ? '👧' : '👦'}
              </div>
              <div
                className="absolute -bottom-1.5 -left-1.5 px-2 py-0.5 rounded-full text-xs font-black"
                style={{ background: '#F59E0B', color: 'white' }}
              >
                Lvl {calculatedLevel}
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Points', value: points.toLocaleString(), icon: '🏆', color: 'rgba(255,255,255,0.15)' },
              { label: 'Coins', value: coins.toLocaleString(), icon: '🪙', color: 'rgba(245,158,11,0.4)' },
              { label: 'Streak', value: `${streak}🔥`, icon: '', color: 'rgba(249,115,22,0.3)' },
              { label: 'الصف', value: `${profile?.grade_level || 1}`, icon: '📚', color: 'rgba(255,255,255,0.15)' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-2.5 text-center"
                style={{ background: stat.color }}
              >
                <div className="text-white font-black text-base leading-none">{stat.value}</div>
                <div className="text-white/60 text-[10px] font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements preview */}
        <div className="px-5 mt-4">
          <div
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigate('/gamification')}
                className="text-blue-600 text-sm font-bold"
              >
                عرض الكل
              </button>
              <h3 className="font-black text-slate-900 text-base">الإنجازات</h3>
            </div>
            <div className="flex gap-3">
              {['🏆', '🔥', '🧠', '📚'].map((ach, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-xl py-3 flex items-center justify-center text-2xl"
                  style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
                >
                  {ach}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="px-5 mt-4">
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(`/${item.screen}`)}
                className="w-full flex items-center gap-3 px-4 py-4 text-right active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
              >
                <span className="text-slate-300 text-base">‹</span>
                {item.badge && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ background: '#EF4444' }}
                  >
                    {item.badge}
                  </div>
                )}
                <div className="flex-1 text-right">
                  <span
                    className="font-bold text-base"
                    style={{ color: item.highlight ? '#F59E0B' : '#0F172A' }}
                  >
                    {item.label}
                  </span>
                  {item.highlight && (
                    <span
                      className="mr-2 text-xs font-black px-2 py-0.5 rounded-lg"
                      style={{ background: '#FEF3C7', color: '#92400E' }}
                    >
                      مميز
                    </span>
                  )}
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: item.highlight
                      ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
                      : '#F8FAFC',
                  }}
                >
                  {item.icon}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}