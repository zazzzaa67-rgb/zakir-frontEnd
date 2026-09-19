import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getStoredProfile, getSubjectsByTrack, restoreSession, Subject } from '../lib/api';

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
  const isMounted = useRef(true);

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // 1. جلب البيانات المخزنة محلياً
      let profile = getStoredProfile();

      // 2. إذا لم يجد track_id محلياً، يحاول استعادة الجلسة من السيرفر فوراً
      if (!profile?.track_id) {
        profile = await restoreSession();
      }

      if (!profile?.track_id) {
        if (isMounted.current) {
          setError('لم يتم العثور على المسار الدراسي الخاص بحسابك. يرجى إعادة تسجيل الدخول.');
          setLoading(false);
        }
        return;
      }

      // 3. جلب المواد باستخدام track_id المؤكد
      const data = await getSubjectsByTrack(profile.track_id);

      if (isMounted.current) {
        if (data && data.length > 0) {
          setSubjects(data);
        } else {
          // الحفاظ على القائمة السابقة في حال حدوث رد فارغ مؤقت
          setSubjects((prev) => (prev.length > 0 ? prev : []));
        }
      }
    } catch (err: any) {
      if (isMounted.current) {
        console.error('Failed to load subjects:', err);
        setError('حدث خطأ أثناء تحميل المواد الدراسية.');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadSubjects();

    return () => {
      isMounted.current = false;
    };
  }, [loadSubjects]);

  const totalLessons = subjects.reduce((sum, subject) => {
    return (
      sum +
      (subject.books ?? []).reduce(
        (bookSum, book) => bookSum + (book.total_lessons_generated ?? 0),
        0
      )
    );
  }, 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]" dir="rtl">
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

        {loading && subjects.length === 0 && (
          <div className="text-center text-slate-500 py-10 font-bold">جاري تحميل المواد...</div>
        )}

        {error && subjects.length === 0 && (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <span className="text-red-500 font-bold">{error}</span>
            <button
              onClick={loadSubjects}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              إعادة المحاولة 🔄
            </button>
          </div>
        )}

        {!loading && !error && subjects.length === 0 && (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <span className="text-slate-500 font-bold">لا توجد مواد مرتبطة بمسارك حاليا</span>
            <button
              onClick={loadSubjects}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              تحديث الصفحة 🔄
            </button>
          </div>
        )}

        {subjects.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject, index) => {
              const [icon, color, bg] = subjectStyles[index % subjectStyles.length];
              const total = (subject.books ?? []).reduce(
                (sum, book) => sum + (book.total_lessons_generated ?? 0),
                0
              );

              return (
                <button
                  key={subject.id}
                  onClick={() =>
                    navigate(`/lesson-list/${subject.id}`, {
                      state: { subject: subject.title, icon },
                    })
                  }
                  className="rounded-2xl p-4 text-right active:scale-95 transition-transform cursor-pointer"
                  style={{
                    background: 'white',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 mr-auto"
                    style={{ background: bg }}
                  >
                    {icon}
                  </div>

                  <div className="font-black text-slate-900 text-sm leading-tight mb-1">
                    {subject.title}
                  </div>

                  <div className="font-bold text-xs mb-2" style={{ color }}>
                    {total ? 'متاح للمذاكرة' : 'قريبا'}
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: total ? '100%' : '0%', background: color }}
                    />
                  </div>

                  <div className="text-xs text-slate-400 font-medium">{total} درس</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav active="subjects" />
    </div>
  );
}