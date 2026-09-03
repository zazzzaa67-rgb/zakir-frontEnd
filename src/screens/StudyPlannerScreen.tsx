import { useState } from 'react';
import { NavProps } from '../App';

const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const today = 1;

const sessions = [
  { day: 1, time: '06:00 PM', subject: '📐 رياضيات', lesson: 'المعادلات الخطية', status: 'pending', color: '#1E6FF0' },
  { day: 1, time: '08:00 PM', subject: '🔬 العلوم', lesson: 'الحركة والقوة', status: 'completed', color: '#10B981' },
  { day: 2, time: '05:00 PM', subject: '📖 عربي', lesson: 'النحو والصرف', status: 'pending', color: '#F97316' },
  { day: 3, time: '07:00 PM', subject: '⚛️ فيزياء', lesson: 'الكهرباء', status: 'pending', color: '#7C3AED' },
  { day: 4, time: '04:00 PM', subject: '📐 رياضيات', lesson: 'الهندسة', status: 'pending', color: '#1E6FF0' },
];

export default function StudyPlannerScreen({ navigate }: NavProps) {
  const [selectedDay, setSelectedDay] = useState(today);
  const [showProBanner, setShowProBanner] = useState(true);

  const daySessionsToShow = sessions.filter((s) => s.day === selectedDay);

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #7C3AED 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl">📅</div>
          <button onClick={() => navigate('home')} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <span className="text-white font-bold">→</span>
          </button>
        </div>
        <h1 className="text-2xl font-black text-white text-right mb-1">جدولي الدراسي</h1>
        <p className="text-blue-200 text-sm font-medium text-right">نظّم وقتك، حقق هدفك</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* PRO Banner */}
        {showProBanner && (
          <div
            className="rounded-2xl p-4 mb-4 relative"
            style={{
              background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
              boxShadow: '0 4px 20px rgba(49,46,129,0.3)',
            }}
          >
            <button
              onClick={() => setShowProBanner(false)}
              className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs"
            >
              ×
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-xs font-black px-2 py-1 rounded-lg"
                style={{ background: '#F59E0B', color: 'white' }}
              >
                PRO
              </span>
              <span className="text-white font-black text-base">ميزة حصرية للمشتركين</span>
            </div>
            <p className="text-indigo-300 text-sm font-medium mb-3 text-right">
              جدول مذاكرة شخصي وتذكيرات ذكية متاحة في خطة PRO
            </p>
            <button
              onClick={() => navigate('pro')}
              className="px-5 py-2.5 rounded-xl text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)' }}
            >
              اشترك في PRO 🚀
            </button>
          </div>
        )}

        {/* Week view */}
        <h2 className="text-slate-900 text-base font-black mb-3 text-right">هذا الأسبوع</h2>
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {weekDays.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all"
                style={{
                  background: selectedDay === i
                    ? 'linear-gradient(135deg, #1E6FF0, #7C3AED)'
                    : 'white',
                  color: selectedDay === i ? 'white' : '#64748B',
                  boxShadow: selectedDay === i ? '0 4px 12px rgba(30,111,240,0.35)' : '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-[10px] font-bold"
                style={{ color: selectedDay === i ? '#1E6FF0' : '#94A3B8' }}
              >
                {day.slice(0, 3)}
              </span>
              {sessions.some((s) => s.day === i) && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: selectedDay === i ? '#1E6FF0' : '#CBD5E1' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Sessions for selected day */}
        <div className="flex items-center justify-between mb-3">
          <button
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600"
          >
            <span>+</span>
            <span>إضافة جلسة</span>
          </button>
          <h3 className="text-slate-900 font-black text-base">
            {weekDays[selectedDay]}
          </h3>
        </div>

        {daySessionsToShow.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            <div className="text-4xl mb-3">📅</div>
            <div className="font-black text-slate-700 text-base mb-1">مفيش جلسات</div>
            <div className="text-slate-400 text-sm font-medium">أضف جلسة مذاكرة لهذا اليوم</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {daySessionsToShow.map((session, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 flex items-center gap-3"
                style={{
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  borderRight: `4px solid ${session.color}`,
                }}
              >
                <div className="flex flex-col items-end flex-1 text-right">
                  <div className="font-black text-slate-900 text-base">{session.subject}</div>
                  <div className="text-slate-500 text-sm font-medium mt-0.5">{session.lesson}</div>
                  <div className="text-slate-400 text-xs font-medium mt-1">⏰ {session.time}</div>
                </div>
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: session.color + '18' }}
                  >
                    {session.status === 'completed' ? '✅' : '⏳'}
                  </div>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: session.status === 'completed' ? '#10B981' : '#F97316' }}
                  >
                    {session.status === 'completed' ? 'مكتملة' : 'قادمة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reminder card */}
        <div
          className="mt-4 rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
            border: '1.5px solid #FDE68A',
          }}
        >
          <div className="flex-1 text-right">
            <div className="font-black text-amber-900 text-sm mb-0.5">🔔 تذكير ذكي</div>
            <div className="text-amber-700 text-xs font-medium">
              "خطوة صغيرة النهارده = فرق كبير بكرة 💪"
            </div>
          </div>
          <span className="text-2xl">⏰</span>
        </div>
      </div>
    </div>
  );
}
