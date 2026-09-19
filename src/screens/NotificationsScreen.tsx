import { useState } from 'react';
import {useNavigate } from 'react-router-dom'
const notifications = [
  {
    id: 1,
    icon: '🔥',
    title: 'حافظت على الـ Streak!',
    body: '7 أيام متتالية — استمر هكذا! 💪',
    time: 'منذ 5 دقائق',
    read: false,
    color: '#F97316',
    bg: '#FFF7ED',
    action: 'gamification' as const,
  },
  {
    id: 2,
    icon: '🏆',
    title: 'وصلت Level جديد!',
    body: 'ألتحقت بـ Level 12 — إنجاز رائع!',
    time: 'منذ ساعة',
    read: false,
    color: '#F59E0B',
    bg: '#FFFBEB',
    action: 'gamification' as const,
  },
  {
    id: 3,
    icon: '🎉',
    title: 'خلصت درس جديد!',
    body: 'أحسنت على إكمال درس المعادلات الخطية. +30 Points',
    time: 'منذ 2 ساعة',
    read: true,
    color: '#10B981',
    bg: '#F0FDF4',
    action: 'home' as const,
  },
  {
    id: 4,
    icon: '🔔',
    title: 'حان وقت المذاكرة!',
    body: 'كان عندك جلسة رياضيات الساعة 6 مساءً',
    time: 'منذ 3 ساعات',
    read: true,
    color: '#1E6FF0',
    bg: '#EFF6FF',
    action: 'planner' as const,
  },
  {
    id: 5,
    icon: '📚',
    title: 'عندك درس مستنيك',
    body: 'درس الهندسة المثلثية لسه ما خلصتوش!',
    time: 'أمس',
    read: true,
    color: '#7C3AED',
    bg: '#F5F3FF',
    action: 'subjects' as const,
  },
  {
    id: 6,
    icon: '💡',
    title: 'AI نصيحة',
    body: 'حاول تذاكر في أوقات ثابتة كل يوم للحصول على نتائج أفضل',
    time: 'منذ يومين',
    read: true,
    color: '#0EA5E9',
    bg: '#F0F9FF',
    action: 'home' as const,
  },
];

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <div className="flex items-center justify-between mb-2">
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-blue-400"
            >
              قراءة الكل
            </button>
          )}
          <div className="flex items-center gap-2 justify-end">
            {unread > 0 && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ background: '#EF4444' }}
              >
                {unread}
              </div>
            )}
            <h1 className="text-2xl font-black text-white">الإشعارات</h1>
          </div>
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <span className="text-white font-bold">→</span>
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {unread > 0 && (
          <h3 className="text-slate-500 text-xs font-bold mb-2 text-right">جديد</h3>
        )}

        <div className="flex flex-col gap-3">
          {items.map((notif, i) => (
            <div key={notif.id}>
              {/* Separator between read/unread */}
              {i > 0 && items[i - 1].read === false && notif.read === true && (
                <h3 className="text-slate-500 text-xs font-bold mb-2 mt-1 text-right">سابق</h3>
              )}

              <button
                onClick={() => {
                  setItems(items.map((n) => n.id === notif.id ? { ...n, read: true } : n));
                  navigate(notif.action);
                }}
                className="w-full bg-white rounded-2xl p-4 flex items-start gap-3 text-right active:scale-98 transition-all"
                style={{
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: notif.read ? 'none' : `1.5px solid ${notif.color}33`,
                }}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0"
                    style={{ background: notif.color }}
                  />
                )}
                {notif.read && <div className="w-2.5 flex-shrink-0" />}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-black text-sm mb-0.5"
                    style={{ color: notif.read ? '#64748B' : '#0F172A' }}
                  >
                    {notif.title}
                  </div>
                  <div className="text-slate-500 text-xs font-medium leading-relaxed mb-1">
                    {notif.body}
                  </div>
                  <div className="text-slate-400 text-[10px] font-medium">{notif.time}</div>
                </div>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: notif.bg }}
                >
                  {notif.icon}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Task reminder widget */}
        <div
          className="mt-4 rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
            boxShadow: '0 4px 20px rgba(49,46,129,0.3)',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">🔔</span>
            <div className="text-right">
              <div className="text-white font-black text-base">حان وقت المذاكرة!</div>
              <div className="text-indigo-300 text-sm font-medium mt-0.5">كان عندك مهمة في جدولك</div>
            </div>
          </div>
          <div className="text-indigo-200 text-sm font-semibold mb-4 text-right">
            أنجزتها؟
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('home')}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5' }}
            >
              ⏰ لسه، ذكرني
            </button>
            <button
              onClick={() => navigate('gamification')}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: '#10B981' }}
            >
              ✅ أيوه خلصتها
            </button>
          </div>
          <p className="text-center text-indigo-300 text-xs font-medium mt-3">
            "خطوة صغيرة النهارده = فرق كبير بكرة 💪"
          </p>
        </div>
      </div>
    </div>
  );
}
