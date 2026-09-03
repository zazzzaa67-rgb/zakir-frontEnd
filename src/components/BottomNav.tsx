import { AppScreen } from '../App';

interface BottomNavProps {
  active: 'home' | 'subjects' | 'ai_lesson' | 'gamification' | 'profile';
  navigate: (screen: AppScreen) => void;
}

export default function BottomNav({ active, navigate }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: '🏠', label: 'الرئيسية' },
    { id: 'subjects' as const, icon: '📚', label: 'المواد' },
    { id: 'ai_lesson' as const, icon: '🤖', label: 'ذاكر معي', center: true },
    { id: 'gamification' as const, icon: '🏆', label: 'تقدمي' },
    { id: 'profile' as const, icon: '👤', label: 'حسابي' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-4 pt-2"
      style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
      {tabs.map((tab) =>
        tab.center ? (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className="flex flex-col items-center -mt-6"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1E6FF0 0%, #7C3AED 100%)',
                boxShadow: '0 4px 16px rgba(30,111,240,0.4)',
              }}
            >
              {tab.icon}
            </div>
            <span
              className="text-[10px] mt-1 font-semibold"
              style={{ color: active === tab.id ? '#1E6FF0' : '#94A3B8' }}
            >
              {tab.label}
            </span>
          </button>
        ) : (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors"
          >
            <span
              className="text-xl transition-transform"
              style={{
                filter: active === tab.id ? 'none' : 'grayscale(1) opacity(0.5)',
                transform: active === tab.id ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              {tab.icon}
            </span>
            <span
              className="text-[10px] font-semibold transition-colors"
              style={{ color: active === tab.id ? '#1E6FF0' : '#94A3B8' }}
            >
              {tab.label}
            </span>
          </button>
        )
      )}
    </div>
  );
}
