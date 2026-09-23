import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

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
}

export default function GamificationScreen() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // استبدل الـ URL برابط الـ API الخاص بك
        const profileRes = await fetch('/api/student/profile');
        const profileData = await profileRes.json();
        
        const leaderboardRes = await fetch('/api/student/leaderboard');
        const leaderboardData = await leaderboardRes.json();

        setProfile(profileData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        console.error('Error loading gamification data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-5 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
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
                Level {profile?.level || 1}
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs font-medium mb-0.5">XP Progress</div>
                <div className="text-white font-black text-lg">
                  {profile?.points_progress.current || 0} / {profile?.points_progress.target || 250}
                </div>
              </div>
            </div>

            <div className="h-3 bg-white/15 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${profile?.points_progress.percentage || 0}%`,
                  background: 'linear-gradient(90deg, #F59E0B, #F97316)',
                  boxShadow: '0 0 12px rgba(245,158,11,0.6)',
                }}
              />
            </div>
            <div className="flex justify-between text-white/50 text-xs font-medium">
              <span>Level {(profile?.level || 1) + 1} بعد {250 - (profile?.points_progress.current || 0)} نقطة</span>
              <span>{profile?.points_progress.percentage || 0}% مكتمل</span>
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
            {leaderboard.map((player, index) => (
              <div
                key={player.id}
                className="rounded-2xl px-4 py-3 flex items-center gap-3 bg-white"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 text-right">
                  <div className="font-black text-sm text-slate-900">{player.name}</div>
                </div>
                <div className="font-black text-sm text-blue-600">
                  {player.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="gamification" />
    </div>
  );
}