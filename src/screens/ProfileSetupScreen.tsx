import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signUp } from '../lib/api';

const tracks = {
  1: [{ id: 'general_1st', label: 'عام' }],
  2: [
    { id: 'medicine_2nd', label: 'الطب وعلوم الحياة' },
    { id: 'engineering_2nd', label: 'الهندسة وعلوم الحاسب' },
    { id: 'business_2nd', label: 'الأعمال' },
    { id: 'arts_2nd', label: 'الآداب والفنون' },
  ],
  3: [
    { id: 'scientific_science_3rd', label: 'علمي علوم' },
    { id: 'scientific_math_3rd', label: 'علمي رياضة' },
    { id: 'literary_3rd', label: 'أدبي' },
    { id: 'business_3rd', label: 'الأعمال - بكالوريا' },
    { id: 'arts_3rd', label: 'الآداب والفنون - بكالوريا' },
  ],
} as const;

interface LocationState {
  email?: string;
  password?: string;
}

export default function ProfileSetupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const credentials = (location.state as LocationState) || {};

  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | ''>('');
  const [grade, setGrade] = useState<1 | 2 | 3 | 0>(0);
  const [trackId, setTrackId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function finish() {
    setError('');
    setLoading(true);
    try {
      await signUp({
        email: String(credentials.email || ''),
        password: String(credentials.password || ''),
        displayName,
        gender,
        gradeLevel: grade,
        trackId,
      });
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  }

  const canProceed = Boolean(displayName.trim() && gender && grade && trackId);

  return (
    <div className="w-full h-full flex flex-col bg-[#F8F9FF]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">ثانوي عام</span>
          <span className="text-xs font-bold text-slate-400">بياناتك التعليمية</span>
        </div>
        <h1 className="mb-1 text-2xl font-black text-slate-900">خلّي فهمتها يعرفك</h1>
        <p className="text-sm font-medium text-slate-500">اختياراتك هتحدد المواد والكتب اللي هتظهر لك.</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="اسمك الأول"
          className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-blue-500 text-right font-medium"
        />

        <p className="mb-2 text-sm font-black text-slate-800 text-right">النوع</p>
        <div className="mb-5 grid grid-cols-2 gap-3">
          {(
            [
              { id: 'boy', label: 'ولد', icon: '👦' },
              { id: 'girl', label: 'بنت', icon: '👧' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setGender(item.id)}
              className={`rounded-2xl border-2 bg-white p-4 font-black cursor-pointer transition-all ${
                gender === item.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-700'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <p className="mb-2 text-sm font-black text-slate-800 text-right">الصف</p>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {([1, 2, 3] as const).map((item) => (
            <button
              key={item}
              onClick={() => {
                setGrade(item);
                setTrackId('');
              }}
              className={`rounded-2xl border-2 p-3 text-sm font-black cursor-pointer transition-all ${
                grade === item ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-700'
              }`}
            >
              الصف {item === 1 ? 'الأول' : item === 2 ? 'الثاني' : 'الثالث'}
            </button>
          ))}
        </div>

        {grade > 0 && (
          <>
            <p className="mb-2 text-sm font-black text-slate-800 text-right">
              {grade === 1 ? 'المسار' : 'الشعبة / المسار'}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {tracks[grade as 1 | 2 | 3].map((track) => (
                <button
                  key={track.id}
                  onClick={() => setTrackId(track.id)}
                  className={`rounded-2xl border-2 p-4 text-right font-black cursor-pointer transition-all ${
                    trackId === track.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-700'
                  }`}
                >
                  {track.label}
                  <span className="float-left">{trackId === track.id ? '✓' : '○'}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600 text-right">{error}</p>}
      </div>

      {/* Next button */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={finish}
          disabled={!canProceed || loading}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: canProceed ? 'linear-gradient(135deg, #1E6FF0, #7C3AED)' : '#E2E8F0',
            color: canProceed ? 'white' : '#94A3B8',
            boxShadow: canProceed ? '0 8px 24px rgba(30,111,240,0.4)' : 'none',
          }}
        >
          {loading ? 'جاري إنشاء الحساب...' : 'ابدأ التعلم 🚀'}
        </button>
      </div>
    </div>
  );
}