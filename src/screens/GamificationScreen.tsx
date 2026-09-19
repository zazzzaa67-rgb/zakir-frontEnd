import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const achievements = [
  { icon: '🏆', label: 'أول درس', unlocked: true },
  { icon: '🔥', label: '7 أيام متتالية', unlocked: true },
  { icon: '🧠', label: '100 سؤال', unlocked: true },
  { icon: '📚', label: '10 دروس', unlocked: true },
  { icon: '🎯', label: 'درجة كاملة', unlocked: false },
  { icon: '⚡', label: '30 يوم', unlocked: false },
  { icon: '🌟', label: '50 درس', unlocked: false },
  { icon: '👑', label: 'المركز الأول', unlocked: false },
];

const leaderboard = [
  { rank: 1, name: 'سارة محمد', points: 1850, isMe: false },
  { rank: 2, name: 'كريم أحمد', points: 1620, isMe: false },
  { rank: 3, name: 'منة علي', points: 1480, isMe: false },
  { rank: 4, name: 'أنت (أحمد)', points: 1250, isMe: true },
  { rank: 5, name: 'يوسف خالد', points: 1100, isMe: false },
];

const rankColors: Record<number, string> = { 1: '#F59E0B', 2: '#94A3B8', 3: '#CD7C2F' };
const rankBg: Record<number, string> = { 1: '#FFFBEB', 2: '#F8FAFC', 3: '#FFF7ED' };

export default function GamificationScreen() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Header */}
        <div
          className="px-5 pt-12 pb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #4338CA 100%)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(30%, -30%)' }} />

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
                Level 12
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs font-medium mb-0.5">XP Progress</div>
                <div className="text-white font-black text-lg">1,250 / 1,500</div>
              </div>
            </div>

            <div className="h-3 bg-white/15 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: '83%',
                  background: 'linear-gradient(90deg, #F59E0B, #F97316)',
                  boxShadow: '0 0 12px rgba(245,158,11,0.6)',
                }}
              />
            </div>
            <div className="flex justify-between text-white/50 text-xs font-medium">
              <span>Level 13 بعد 250 نقطة</span>
              <span>83% مكتمل</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 px-5 mt-4">
          {[
            { label: 'اليوم', value: '+85', icon: '⚡', color: '#1E6FF0' },
            { label: 'الأسبوع', value: '+420', icon: '📈', color: '#10B981' },
            { label: 'الـ Streak', value: '7🔥', icon: '🔥', color: '#F97316' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 bg-white rounded-2xl p-3 text-center"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="text-lg font-black mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-600 text-sm font-bold">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length}
            </span>
            <h2 className="text-slate-900 text-lg font-black">الإنجازات</h2>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.label}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: ach.unlocked
                      ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)'
                      : '#F1F5F9',
                    border: ach.unlocked ? '1.5px solid #FDE68A' : '1.5px solid #E2E8F0',
                    filter: ach.unlocked ? 'none' : 'grayscale(1) opacity(0.4)',
                    boxShadow: ach.unlocked ? '0 4px 12px rgba(245,158,11,0.2)' : 'none',
                  }}
                >
                  {ach.icon}
                </div>
                <span
                  className="text-[9px] font-bold text-center leading-tight"
                  style={{ color: ach.unlocked ? '#92400E' : '#94A3B8' }}
                >
                  {ach.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="px-5 mt-5">
          <h2 className="text-slate-900 text-lg font-black mb-3 text-right">ترتيبك 🏅</h2>

          <div className="flex flex-col gap-2.5">
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: player.isMe
                    ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
                    : rankBg[player.rank] || 'white',
                  border: player.isMe ? '1.5px solid #93C5FD' : '1.5px solid transparent',
                  boxShadow: player.isMe ? '0 4px 16px rgba(30,111,240,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Rank badge */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{
                    background: rankColors[player.rank] ? rankColors[player.rank] + '22' : '#F1F5F9',
                    color: rankColors[player.rank] || (player.isMe ? '#1E6FF0' : '#64748B'),
                  }}
                >
                  {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
                </div>

                {/* Name */}
                <div className="flex-1 text-right">
                  <div
                    className="font-black text-sm"
                    style={{ color: player.isMe ? '#1E40AF' : '#0F172A' }}
                  >
                    {player.name}
                  </div>
                </div>

                {/* Points */}
                <div
                  className="font-black text-sm"
                  style={{ color: rankColors[player.rank] || (player.isMe ? '#1E6FF0' : '#64748B') }}
                >
                  {player.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="gamification"/>
    </div>
  );
}
