import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ApiLesson, getLessonsBySubject, getStoredProfile } from '../lib/api';

type LessonStatus = 'completed' | 'in_progress' | 'available' | 'locked';

interface Lesson {
  id: string | number;
  title: string;
  difficulty: string;
  time: string;
  points: number;
  coinCost?: number;
  order_index?: number;
  status: LessonStatus;
}

const mockUnits: { title: string; subtitle: string; lessons: Lesson[] }[] = [
  {
    title: 'الوحدة الأولى',
    subtitle: 'الدروس المتاحة',
    lessons: [
      { id: 1, title: 'المعادلات الخطية', difficulty: 'متوسط', time: '25 دقيقة', points: 30, status: 'completed' },
      { id: 2, title: 'المتباينات', difficulty: 'متوسط', time: '20 دقيقة', points: 25, status: 'in_progress' },
      { id: 3, title: 'الدوال', difficulty: 'صعب', time: '35 دقيقة', points: 40, status: 'available' },
    ],
  },
];

const statusConfig: Record<LessonStatus, { label: string; color: string; bg: string }> = {
  completed: { label: '✓ مكتمل', color: '#10B981', bg: '#F0FDF4' },
  in_progress: { label: '⏳ جاري', color: '#F97316', bg: '#FFF7ED' },
  available: { label: '🔓 متاح', color: '#1E6FF0', bg: '#EFF6FF' },
  locked: { label: '🔒 مقفول', color: '#94A3B8', bg: '#F8FAFC' },
};

const difficultyColor: Record<string, string> = {
  'سهل': '#10B981',
  'متوسط': '#F59E0B',
  'صعب': '#EF4444',
};

export default function LessonListScreen() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // جلب البيانات مع توفير القيم الافتراضية بأمان
  const stateData = (location.state as { subjectTitle?: string; subject?: string; icon?: string }) || {};
  const subjectTitle = stateData.subjectTitle || stateData.subject || 'المادة الدراسية';
  const icon = stateData.icon || '📚';

  const profile = getStoredProfile();
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [loading, setLoading] = useState(Boolean(subjectId && subjectId !== 'undefined'));
  const [error, setError] = useState('');

  useEffect(() => {
    // حماية الصفحة من التحويل للـ Home إذا كان المعرف undefined
    if (!subjectId || subjectId === 'undefined') {
      console.warn('⚠️ subjectId غير معرف، يتم التوجيه إلى المواد.');
      navigate('/subjects', { replace: true });
      return;
    }

    setLoading(true);
    setError('');

    getLessonsBySubject(subjectId, profile?.track_id)
      .then((data) => {
        if (Array.isArray(data)) {
          setLessons(data);
        } else {
          setLessons([]);
        }
      })
      .catch((requestError) => {
        console.error('Failed to load lessons:', requestError);
        setError(requestError.message || 'حدث خطأ أثناء تحميل الدروس');
      })
      .finally(() => setLoading(false));
  }, [subjectId, profile?.track_id, navigate]);

  const visibleUnits = useMemo(() => {
    if (!subjectId || subjectId === 'undefined') return mockUnits;
    if (!lessons.length) return [];

    const grouped = new Map<string, Lesson[]>();

    lessons.forEach((lesson) => {
      const item = lesson as any;
      const unitTitle = lesson.unit_title || lesson.chapter_name || 'دروس المادة';
      const current = grouped.get(unitTitle) ?? [];

      let status: LessonStatus = 'available';
      if (item.is_unlocked === false) {
        status = 'locked';
      } else if (item.status) {
        status = item.status as LessonStatus;
      }

      grouped.set(unitTitle, [
        ...current,
        {
          id: lesson.id,
          title: lesson.lesson_title || 'درس بدون عنوان',
          difficulty: lesson.difficulty || 'متوسط',
          time: lesson.duration_minutes ? `${lesson.duration_minutes} دقيقة` : '15 دقيقة',
          points: lesson.points_reward ?? 20,
          coinCost: lesson.coins_cost ?? 0,
          status,
        },
      ]);
    });

    return Array.from(grouped, ([title, unitLessons]) => ({
      title,
      subtitle: '',
      lessons: unitLessons,
    }));
  }, [lessons, subjectId]);

  const totalLessonsCount = lessons.length;

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF] text-right" dir="rtl">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #0D4FB5 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/subjects')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-white text-lg font-bold">←</span>
          </button>
          <div className="text-3xl">{icon}</div>
        </div>

        <h1 className="text-2xl font-black text-white">{subjectTitle}</h1>

        <div className="flex items-center gap-2 mt-2 justify-start">
          <div className="text-white text-sm font-bold">0%</div>
          <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '0%' }} />
          </div>
          <div className="text-blue-200 text-sm font-medium">{totalLessonsCount} درس</div>
        </div>
      </div>

      {/* Units and lessons list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20">
        {loading && (
          <div className="text-center text-slate-500 py-10 font-bold">جاري تحميل الدروس...</div>
        )}

        {error && (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <span className="text-red-500 font-bold">{error}</span>
            <button
              onClick={() => navigate(0)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              إعادة المحاولة 🔄
            </button>
          </div>
        )}

        {!loading && !error && visibleUnits.length === 0 && (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <span className="text-slate-500 font-bold">لا توجد دروس مضافة لهذه المادة حالياً</span>
            <button
              onClick={() => navigate('/subjects')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              الرجوع للمواد
            </button>
          </div>
        )}

        {!error &&
          visibleUnits.map((unit) => (
            <div key={unit.title} className="mb-5">
              {/* Unit Header */}
              <div className="flex items-center justify-start gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: '#1E6FF022' }}
                >
                  📂
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-semibold">{unit.title}</div>
                  <div className="text-base font-black text-slate-900">
                    {unit.subtitle || 'دروس الوحدة'}
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="flex flex-col gap-2.5">
                {unit.lessons.map((lesson) => {
                  const st = statusConfig[lesson.status] || statusConfig.available;
                  const isLocked = lesson.status === 'locked';
                  const isCompleted = lesson.status === 'completed';

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => !isLocked && navigate(`/ai-lesson/${lesson.id}`)}
                      className={`bg-white rounded-2xl p-4 flex items-center gap-3 text-right transition-transform ${
                        isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer active:scale-98'
                      }`}
                      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
                    >
                      {/* Status icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-bold"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {isCompleted ? '✓' : isLocked ? '🔒' : lesson.order_index ?? lesson.id}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-black text-sm leading-tight mb-1"
                          style={{ color: isLocked ? '#94A3B8' : '#0F172A' }}
                        >
                          {lesson.title}
                        </div>
                        <div className="flex items-center gap-2 justify-start flex-wrap">
                          <span className="text-xs text-slate-400 font-medium">⏱️ {lesson.time}</span>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-md"
                            style={{
                              background:
                                (difficultyColor[lesson.difficulty] || '#94A3B8') + '18',
                              color: difficultyColor[lesson.difficulty] || '#94A3B8',
                            }}
                          >
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Right: Reward or Unlock */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {isLocked ? (
                          <>
                            <div className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                              🪙 {lesson.coinCost}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/coins');
                              }}
                              className="text-xs font-bold text-white px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 cursor-pointer active:scale-95 transition-transform"
                            >
                              افتح
                            </button>
                          </>
                        ) : (
                          <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            +{lesson.points} pts
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}