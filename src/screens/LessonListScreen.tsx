import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const units: { title: string; subtitle: string; lessons: Lesson[] }[] = [
  {
    title: 'الوحدة الأولى',
    subtitle: 'الجبر',
    lessons: [
      { id: 1, title: 'المعادلات الخطية', difficulty: 'متوسط', time: '25 دقيقة', points: 30, status: 'completed' },
      { id: 2, title: 'المتباينات', difficulty: 'متوسط', time: '20 دقيقة', points: 25, status: 'in_progress' },
      { id: 3, title: 'الدوال', difficulty: 'صعب', time: '35 دقيقة', points: 40, status: 'available' },
    ],
  },
  {
    title: 'الوحدة الثانية',
    subtitle: 'الهندسة',
    lessons: [
      { id: 4, title: 'المثلثات', difficulty: 'سهل', time: '15 دقيقة', points: 20, coinCost: 15, status: 'locked' },
      { id: 5, title: 'الدوائر', difficulty: 'متوسط', time: '25 دقيقة', points: 30, coinCost: 15, status: 'locked' },
      { id: 6, title: 'الأشكال الرباعية', difficulty: 'سهل', time: '18 دقيقة', points: 20, coinCost: 15, status: 'locked' },
    ],
  },
  {
    title: 'الوحدة الثالثة',
    subtitle: 'الإحصاء',
    lessons: [
      { id: 7, title: 'التوزيعات', difficulty: 'صعب', time: '40 دقيقة', points: 50, coinCost: 20, status: 'locked' },
      { id: 8, title: 'الاحتمالات', difficulty: 'صعب', time: '35 دقيقة', points: 45, coinCost: 20, status: 'locked' },
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

  const subject = 'الرياضيات';
  const icon = '📐';
  const profile = getStoredProfile();
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [loading, setLoading] = useState(Boolean(subjectId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    setError('');

    getLessonsBySubject(subjectId, profile?.track_id)
      .then(setLessons)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [subjectId, profile?.track_id]);

  const visibleUnits = useMemo(() => {
    if (!subjectId) return units;
    const grouped = new Map<string, Lesson[]>();
    lessons.forEach((lesson) => {
      const unitTitle = lesson.unit_title || lesson.chapter_name || 'دروس متنوعة';
      const current = grouped.get(unitTitle) ?? [];
      grouped.set(unitTitle, [...current, {
        id: lesson.id,
        title: lesson.lesson_title,
        difficulty: lesson.difficulty,
        time: `${lesson.duration_minutes} دقيقة`,
        points: lesson.points_reward,
        coinCost: lesson.coins_cost,
        status: 'available',
      }]);
    });
    return Array.from(grouped, ([title, unitLessons]) => ({ title, subtitle: '', lessons: unitLessons }));
  }, [lessons, subjectId]);

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1E6FF0 0%, #0D4FB5 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          <button
            onClick={() => navigate('/subjects')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <span className="text-white text-lg font-bold">→</span>
          </button>
        </div>
        <h1 className="text-2xl font-black text-white text-right">{subject}</h1>
        <div className="flex items-center gap-2 mt-2 justify-end">
          <div className="text-blue-200 text-sm font-medium">{lessons.length || 0} درس</div>
          <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '68%' }} />
          </div>
          <div className="text-white text-sm font-bold">68%</div>
        </div>
      </div>

      {/* Units and lessons */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading && <div className="text-center text-slate-500 py-10">جاري تحميل الدروس...</div>}
        {error && <div className="text-center text-red-500 py-10">{error}</div>}
        {!loading && !error && subjectId && visibleUnits.length === 0 && <div className="text-center text-slate-500 py-10">لا توجد دروس لهذه المادة حاليا</div>}
        {!error && visibleUnits.map((unit) => (
          <div key={unit.title} className="mb-5">
            {/* Unit header */}
            <div className="flex items-center justify-end gap-2 mb-3">
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">{unit.title}</div>
                <div className="text-base font-black text-slate-900">{unit.subtitle || 'دروس الوحدة'}</div>
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: '#1E6FF022' }}
              >
                📂
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {unit.lessons.map((lesson) => {
                const st = statusConfig[lesson.status];
                const isLocked = lesson.status === 'locked';
                const isCompleted = lesson.status === 'completed';

                return (
                  <button
                    key={lesson.id}
                    onClick={() => !isLocked && navigate(`/ai-lesson/${lesson.id}`)}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3 text-right active:scale-98 transition-transform"
                    style={{
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      opacity: isLocked ? 0.8 : 1,
                    }}
                  >
                    {/* Status icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
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
                      <div className="flex items-center gap-2 justify-end flex-wrap">
                        <span className="text-xs text-slate-400 font-medium">⏱️ {lesson.time}</span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md"
                          style={{
                            background: (difficultyColor[lesson.difficulty] || '#94A3B8') + '18',
                            color: difficultyColor[lesson.difficulty] || '#94A3B8',
                          }}
                        >
                          {lesson.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Right: reward or unlock */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {isLocked ? (
                        <>
                          <div className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                            🪙 {lesson.coinCost}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate('/coins'); }}
                            className="text-xs font-bold text-white px-3 py-1 rounded-lg"
                            style={{ background: '#F59E0B' }}
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
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
