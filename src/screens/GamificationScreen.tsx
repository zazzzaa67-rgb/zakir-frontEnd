import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import { getCachedProfile } from '../lib/profileManager';
import { fetchAndUpdateProfile, getStudentLeaderboard } from '../lib/api';

interface ProfileData {
  points: number;
  level: number;
  streak: number;
  points_progress: {
    current: number;
    target: number;
    percentage: number;
  };
}

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  isMe?: boolean;
}

export default function GamificationScreen() {
  const [profile, setProfile] = useState<ProfileData | null>(() => {
    const cached = getCachedProfile();
    if (!cached) return null;
    const points = Number(cached.points ?? 0);
    const current = points % 250;
    return {
      points,
      level: Math.floor(points / 250) + 1,
      streak: cached.streak ?? 0,
      points_progress: { current, target: 250, percentage: Math.round((current / 250) * 100) },
    };
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  useEffect(() => {
    // 1. دالة لتجهيز وقراءة بيانات البروفايل المحلية
    const loadLocalProfile = () => {
      const cached:any = getCachedProfile();
      if (cached) {
        const currentPoints = cached.points ?? cached.xp ?? cached.total_points ?? 0;
        const targetPoints = 250;
        const currentProgress = currentPoints % targetPoints;
        const percentage = Math.min(Math.round((currentProgress / targetPoints) * 100), 100);
        const calculatedLevel = cached.level ?? Math.floor(currentPoints / targetPoints) + 1;

        setProfile({
          points: currentPoints,
          level: calculatedLevel,
          streak: cached.streak ?? 0,
          points_progress: {
            current: currentProgress,
            target: targetPoints,
            percentage: percentage,
          },
        });
      }
    };

    // 2. تحميل البيانات المحلية فور فتح الشاشة
    loadLocalProfile();

    // 3. الاستماع للتحديثات اللحظية للبروفايل
    window.addEventListener('profileUpdated', loadLocalProfile);

    let isMounted = true;
    fetchAndUpdateProfile()
      .then((profileData) => {
        if (!isMounted || !profileData) return;
        const points = Number(profileData.points ?? 0);
        const current = points % 250;
        setProfile({
          points,
          level: Math.floor(points / 250) + 1,
          streak: profileData.streak ?? 0,
          points_progress: { current, target: 250, percentage: Math.round((current / 250) * 100) },
        });
      })
      .catch((err) => console.error('Error loading gamification profile:', err));

    getStudentLeaderboard()
      .then((players) => {
        if (isMounted) setLeaderboard(players);
      })
      .catch((err) => console.error('Error loading leaderboard:', err))
      .finally(() => {
        if (isMounted) setLeaderboardLoading(false);
      });

    return () => {
      isMounted = false;
      window.removeEventListener('profileUpdated', loadLocalProfile);
    };
  }, []);
  const currentLevel = profile?.level || 1;
  const currentProgress = profile?.points_progress?.current || 0;
  const targetProgress = profile?.points_progress?.target || 250;
  const percentageProgress = profile?.points_progress?.percentage || 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {leaderboardLoading && (
        <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 bg-blue-50 py-2 text-sm font-bold text-blue-700">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span>جاري تحميل البيانات...</span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div
          className="px-5 pt-12 pb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #4338CA 100%)' }}
        >
          <h1 className="text-2xl font-black text-white text-right mb-5">مستواك 🏆</h1>

          {/* Level card */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="px-3 py-1 rounded-full text-xs font-black"
                style={{ background: '#F59E0B', color: 'white' }}
              >
                Level {currentLevel}
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs font-medium mb-0.5">XP Progress</div>
                <div className="text-white font-black text-lg">
                  {currentProgress} / {targetProgress}
                </div>
              </div>
            </div>

            <div className="h-3 bg-white/15 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percentageProgress}%`,
                  background: 'linear-gradient(90deg, #F59E0B, #F97316)',
                  boxShadow: '0 0 12px rgba(245,158,11,0.6)',
                }}
              />
            </div>
            <div className="flex justify-between text-white/50 text-xs font-medium">
              <span>Level {currentLevel + 1} بعد {targetProgress - currentProgress} نقطة</span>
              <span>{percentageProgress}% مكتمل</span>
            </div>
          </div>
        </div>
        {/* Stats row */}
        <div className="flex gap-3 px-5 mt-4">
          <div className="flex-1 bg-white rounded-2xl p-3 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="text-lg font-black mb-0.5 text-[#F97316]">{profile?.streak || 0} 🔥</div>
            <div className="text-xs text-slate-500 font-medium">الـ Streak</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="px-5 mt-5">
          <h2 className="text-slate-900 text-lg font-black mb-3 text-right">ترتيبك 🏅</h2>
          <div className="flex flex-col gap-2.5">
            {leaderboard.length > 0 ? (
              leaderboard.map((player, index) => (
                <div
                  key={player.id || index}
                  className={`rounded-2xl border px-4 py-3 flex items-center gap-3 transition-colors ${player.isMe ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-200 shadow-[0_4px_14px_rgba(37,99,235,0.14)]' : 'border-transparent bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-black text-sm text-slate-900 flex items-center justify-end gap-2">{player.name}{player.isMe && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] text-white">YOU</span>}</div>
                  </div>
                  <div className="font-black text-sm text-blue-600">
                    {player.points?.toLocaleString() || 0}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-4 text-center text-slate-500 text-sm font-medium">
                لا تتوفر قائمة متصدرين حالياً
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav active="gamification" />
    </div>
  );
}
