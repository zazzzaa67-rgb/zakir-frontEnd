import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getStoredProfile, getSubjectsByTrack, Subject } from '../lib/api';

const subjectStyles = [
  ['📐', '#1E6FF0', '#EFF6FF'], ['🔬', '#10B981', '#F0FDF4'],
  ['📖', '#F97316', '#FFF7ED'], ['🇬🇧', '#7C3AED', '#F5F3FF'],
  ['🌍', '#EF4444', '#FFF5F5'], ['⚛️', '#0EA5E9', '#F0F9FF'],
  ['🧪', '#D946EF', '#FDF4FF'], ['🧬', '#F59E0B', '#FFFBEB'],
] as const;

export default function SubjectsScreen() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const profile = getStoredProfile();
      if (!profile?.track_id) {
        setError('سجل دخولك علشان نعرض موادك الدراسية');
        setLoading(false);
        return;
      }

      getSubjectsByTrack(profile.track_id)
        .then((data) => {
          setSubjects(data || []);
        })
        .catch((requestError) => {
          setError(requestError?.message || 'حدث خطأ أثناء تحميل المواد');
        })
        .finally(() => setLoading(false));
    } catch (err) {
      setError('تعذر الحصول على بيانات المستخدم');
      setLoading(false);
    }
  }, []);

  const totalLessons = (subjects || []).reduce((sum, subject) => {
    return sum + (subject.books ?? []).reduce(
      (bookSum, book) => bookSum + (book.total_lessons_generated ?? 0), 0
    );
  }, 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #0D4FB5 100%)' }}
      >
        <h1 className="text-2xl font-black text-white text-right">المواد الدراسية</h1>
        <p className="text-blue-200 text-sm font-medium mt-1 text-right">
          مواد مسارك الدراسي • {subjects.length} مواد
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {/* Stats row */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="text-2xl font-black text-slate-900">0</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">درس مكتمل</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="text-2xl font-black text-blue-600">0%</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">متوسط التقدم</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="text-2xl font-black text-amber-500">{totalLessons}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">درس متبقي</div>
          </div>
        </div>

        {loading && <div className="text-center text-slate-500 py-10">جاري تحميل المواد...</div>}
        {error && <div className="text-center text-red-500 py-10">{error}</div>}
        {!loading && !error && subjects.length === 0 && (
          <div className="text-center text-slate-500 py-10">لا توجد مواد مرتبطة بمسارك حاليا</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject, index) => {
            const [icon, color, bg] = subjectStyles[index % subjectStyles.length];
            const total = (subject.books ?? []).reduce(
              (sum, book) => sum + (book.total_lessons_generated ?? 0), 0
            );

            return (
              <button
                key={subject.id}
                onClick={() =>
                  navigate('/lesson-list', {
                    state: { subject: subject.title, subjectId: subject.id, icon },
                  })
                }
                className="rounded-2xl p-4 text-right active:scale-95 transition-transform cursor-pointer"
                style={{
                  background: 'white',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 mr-auto"
                  style={{ background: bg }}
                >
                  {icon}
                </div>

                {/* Subject name */}
                <div className="font-black text-slate-900 text-sm leading-tight mb-1">
                  {subject.title}
                </div>

                {/* Progress label */}
                <div className="font-bold text-xs mb-2" style={{ color }}>
                  {total ? 'متاح للمذاكرة' : 'قريبا'}
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: total ? '100%' : '0%', background: color }}
                  />
                </div>

                {/* Lessons count */}
                <div className="text-xs text-slate-400 font-medium">
                  {total} درس
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav active="subjects" />
    </div>
  );
}