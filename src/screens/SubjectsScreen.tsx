import { NavProps } from '../App';
import BottomNav from '../components/BottomNav';

const subjectData = [
  { icon: '📐', name: 'الرياضيات', progress: 68, done: 17, total: 25, color: '#1E6FF0', bg: '#EFF6FF' },
  { icon: '🔬', name: 'العلوم', progress: 42, done: 10, total: 24, color: '#10B981', bg: '#F0FDF4' },
  { icon: '📖', name: 'اللغة العربية', progress: 55, done: 11, total: 20, color: '#F97316', bg: '#FFF7ED' },
  { icon: '🇬🇧', name: 'اللغة الإنجليزية', progress: 30, done: 6, total: 20, color: '#7C3AED', bg: '#F5F3FF' },
  { icon: '🌍', name: 'الدراسات الاجتماعية', progress: 80, done: 16, total: 20, color: '#EF4444', bg: '#FFF5F5' },
  { icon: '⚛️', name: 'الفيزياء', progress: 20, done: 4, total: 20, color: '#0EA5E9', bg: '#F0F9FF' },
  { icon: '🧪', name: 'الكيمياء', progress: 15, done: 3, total: 20, color: '#D946EF', bg: '#FDF4FF' },
  { icon: '🧬', name: 'الأحياء', progress: 50, done: 10, total: 20, color: '#F59E0B', bg: '#FFFBEB' },
];

export default function SubjectsScreen({ navigate }: NavProps) {
  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #0D4FB5 100%)' }}
      >
        <h1 className="text-2xl font-black text-white text-right">المواد الدراسية</h1>
        <p className="text-blue-200 text-sm font-medium mt-1 text-right">ثالثة إعدادي • 8 مواد</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {/* Stats row */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="text-2xl font-black text-slate-900">54</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">درس مكتمل</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="text-2xl font-black text-blue-600">45%</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">متوسط التقدم</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="text-2xl font-black text-amber-500">95</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">درس متبقي</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {subjectData.map((sub) => (
            <button
              key={sub.name}
              onClick={() => navigate('lesson_list', { subject: sub.name, icon: sub.icon })}
              className="rounded-2xl p-4 text-right active:scale-95 transition-transform"
              style={{
                background: 'white',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 mr-auto"
                style={{ background: sub.bg }}
              >
                {sub.icon}
              </div>

              {/* Subject name */}
              <div className="font-black text-slate-900 text-sm leading-tight mb-1">{sub.name}</div>

              {/* Progress label */}
              <div className="font-bold text-xs mb-2" style={{ color: sub.color }}>
                {sub.progress}% مكتمل
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${sub.progress}%`, background: sub.color }}
                />
              </div>

              {/* Lessons count */}
              <div className="text-xs text-slate-400 font-medium">
                {sub.done} / {sub.total} درس
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="subjects" navigate={navigate} />
    </div>
  );
}
