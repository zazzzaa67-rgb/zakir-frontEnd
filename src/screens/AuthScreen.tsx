import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/api';

export default function AuthScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function submit() {
    setError('');
    if (!isValidEmail) {
      setError('اكتب بريدًا إلكترونيًا صحيحًا مثل student@gmail.com');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        // نمرر البيانات عبر state الخاصة بـ react-router
        navigate('/setup', { state: { email, password } });
      } else {
        await signIn(email, password);
        navigate('/home');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#08152b] px-6 text-right text-white">
      <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative pt-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-cyan-300">فهمتها</p>
            <h1 className="text-3xl font-black leading-tight">مستقبلك الدراسي<br />بيبدأ من هنا</h1>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-xl">🎓</div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-xl">
          <div className="mb-6 flex rounded-2xl bg-black/20 p-1">
            {(['signin', 'signup'] as const).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`flex-1 rounded-xl py-3 text-sm font-black transition cursor-pointer ${mode === item ? 'bg-white text-[#0b1a34]' : 'text-white/50'}`}
              >
                {item === 'signin' ? 'تسجيل الدخول' : 'حساب جديد'}
              </button>
            ))}
          </div>
          <label className="mb-2 block text-xs font-bold text-white/60">البريد الإلكتروني</label>
          <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" className="mb-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-left outline-none placeholder:text-white/30 focus:border-cyan-300" />
          <label className="mb-2 block text-xs font-bold text-white/60">كلمة المرور</label>
          <input dir="ltr" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-left outline-none placeholder:text-white/30 focus:border-cyan-300" />
          {error && <p className="mt-3 rounded-xl bg-red-400/15 p-3 text-sm font-bold text-red-200">{error}</p>}
          <button disabled={!isValidEmail || password.length < 6 || loading} onClick={submit} className="mt-6 w-full rounded-2xl bg-cyan-300 py-4 font-black text-[#08203b] shadow-lg shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer">{loading ? 'لحظة...' : mode === 'signin' ? 'ادخل حسابك ←' : 'كمّل بياناتك ←'}</button>
        </div>
        <p className="mt-5 text-center text-xs leading-6 text-white/40">حسابك بيحدد موادك ومسارك وبيخلي تقدمك محفوظ على كل أجهزتك.</p>
      </div>
    </div>
  );
}