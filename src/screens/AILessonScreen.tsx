import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getLessonById, LessonDetails } from '../lib/api';

const modes = [
  { icon: '📄', label: 'ملف الدرس PDF', screen: 'pdf' as const },
  { icon: '📝', label: 'واجب الدرس', screen: 'homework' as const },
  { icon: '🧠', label: 'امتحان الدرس', screen: 'quiz' as const },
];

const initialAiMessages: Array<{ role: 'user' | 'model'; text: string }> = [
  { role: 'model', text: 'أهلاً بك! أنا مساعدك الذكي لمذاكرة هذا الدرس 🤖' },
  { role: 'model', text: 'يمكنك لسؤالي عن أي جزئية غير واضحة، أو طلب أمثلة إضافية وشرح مبسط.' },
];

export default function AILessonScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonId: paramLessonId } = useParams<{ lessonId: string }>();

  // استقبال البيانات من State أو Route Params
  const state = (location.state as { lesson?: string; lessonId?: string }) || {};
  const lessonId = paramLessonId || state.lessonId;

  const [lessonTitle, setLessonTitle] = useState(state.lesson || 'جاري تحميل عنوان الدرس...');
  const [lessonDetails, setLessonDetails] = useState<LessonDetails | null>(null);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>(initialAiMessages);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  // جلب تفاصيل الدرس
  useEffect(() => {
    if (!lessonId) return;

    getLessonById(lessonId)
      .then((details) => {
        setLessonDetails(details);
        if (details?.lesson_title || details?.title) {
          setLessonTitle(details.lesson_title || details.title || '');
        }
      })
      .catch((err) => {
        console.error('Failed to load lesson details:', err);
      });
  }, [lessonId]);

  // فتح أوراق العمل / الاختيارات / PDF
  const openMode = (mode: typeof modes[number]) => {
    if (mode.screen === 'pdf') {
      const pdfUrl = lessonDetails?.content_json?.pdf_summary_url;
      if (pdfUrl) {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      } else {
        setChatError('مذكرة PDF لهذا الدرس غير متاحة حالياً');
      }
      return;
    }

    const questions =
      mode.screen === 'homework'
        ? lessonDetails?.content_json?.homework ?? lessonDetails?.content_json?.quiz
        : lessonDetails?.content_json?.exam ?? lessonDetails?.content_json?.quiz;

    if (!questions || (Array.isArray(questions) && questions.length === 0)) {
      setChatError(`لا يوجد ${mode.label} متاح لهذا الدرس حالياً`);
      return;
    }

    const path = mode.screen === 'homework' ? '/homework' : '/quiz';
    
    // تمرير id و lessonId لتفادي إعادة التوجيه للصفحة الرئيسية
    navigate(path, {
      state: {
        id: lessonId,
        lessonId,
        lesson: lessonTitle,
        lesson_title: lessonTitle,
        questions,
      },
    });
  };

  // إرسال السؤال ومعالجة البث المباشر (Streaming)
  const handleSend = async (textToSend?: string) => {
    const message = (textToSend || userInput).trim();
    if (!message || chatLoading) return;

    if (!lessonId) {
      setChatError('يرجى فتح الدرس من قائمة الدروس أولاً');
      return;
    }

    // إعداد تاريخ المحادثة للسيرفر
    const historyPayload = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    // إدخال رسالة الطالب ورسالة فارغة للـ AI ليتم إكمالها فورياً
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: message },
      { role: 'model', text: '' },
    ]);

    setUserInput('');
    setChatError('');
    setChatLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zakir-backend.vercel.app/api';
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      // تنظيف الـ lessonId من أي نقط زائدة لضمان صحة الـ URL
      const cleanLessonId = lessonId?.replace(/\.{2,}/g, '.').trim();
      const response = await fetch(`${API_BASE_URL}/lessons/${cleanLessonId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'تعذر تشغيل مساعد الدرس');
      }

      if (!response.body) {
        throw new Error('لم يتم استقبال أي بيانات من السيرفر');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // قراءة الـ Chunks المباشرة وتجميع النص في أحدث رسالة
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].role === 'model') {
            next[lastIdx] = {
              ...next[lastIdx],
              text: next[lastIdx].text + chunkText,
            };
          }
          return next;
        });
      }
    } catch (error: any) {
      console.error('Chat AI Error:', error);
      setChatError(error.message || 'حدث خطأ أثناء التواصل مع المعلم الذكي');
      // إزالة الرسالة الفارغة في حالة الخطأ
      setMessages((prev) => prev.filter((m) => m.text.trim() !== ''));
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF] text-right" dir="rtl">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D2356 0%, #1E1B4B 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-white font-bold text-lg">→</span>
          </button>

          <div className="flex gap-2">
            {modes.map((m) => (
              <button
                key={m.label}
                onClick={() => openMode(m)}
                className="text-base px-2.5 py-1.5 rounded-xl bg-white/10 text-white active:bg-white/20 transition-colors"
                title={m.label}
              >
                {m.icon}
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-xl font-black text-white">ذاكر معي 🤖</h1>
        <p className="text-blue-300 text-sm font-medium mt-0.5 truncate">{lessonTitle}</p>
      </div>

      {/* AI Tutor visual + mode cards */}
      <div className="px-5 py-4">
        <div
          className="rounded-2xl p-4 flex items-center gap-4 mb-4"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
            boxShadow: '0 4px 20px rgba(49,46,129,0.3)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
              boxShadow: '0 4px 16px rgba(30,111,240,0.4)',
            }}
          >
            🤖
          </div>
          <div className="text-right flex-1">
            <div className="text-white font-black text-base">مساعد ذاكر الذكي</div>
            <div className="text-indigo-300 text-xs font-medium mt-0.5">جاهز لشرح وتبسيط نقاط الدرس</div>
            <div className="flex items-center gap-1.5 justify-start mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-semibold">نشط الآن</span>
            </div>
          </div>
        </div>

        {/* Mode cards */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {modes.map((m) => (
            <button
              key={m.label}
              onClick={() => openMode(m)}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>

        {chatError && (
          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-right text-xs font-bold text-red-600">
            {chatError}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-5 pb-2">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-sm flex-shrink-0 mt-1">
                      🤖
                    </div>
                    <div
                      className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm font-medium leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
                        color: 'white',
                      }}
                    >
                      {msg.text || (chatLoading && i === messages.length - 1 ? 'جاري الكتابة...' : '')}
                    </div>
                  </div>
                )}
                {isUser && (
                  <div
                    className="max-w-[75%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm font-medium whitespace-pre-wrap"
                    style={{ background: '#E2E8F0', color: '#0F172A' }}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick response buttons */}
          <div className="flex flex-wrap gap-2 justify-start mt-2">
            {[
              { label: '👍 أيوه فهمت', text: 'اديني مثال كمان من الدرس' },
              { label: '🤔 اشرحها تاني', text: 'اشرح النقطة دي بطريقة أبسط' },
              { label: '❓ ملخص الدرس', text: 'ممكن تلخصلي الدرس في نقاط سريعة؟' },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => void handleSend(btn.text)}
                disabled={chatLoading}
                className="px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-transform cursor-pointer bg-white text-blue-600 border border-blue-100 shadow-sm disabled:opacity-50"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="px-5 pb-20 pt-3 bg-white border-t border-slate-100">
        <div className="flex gap-2 items-center">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
            placeholder="اسألني أي سؤال عن الدرس..."
            className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 text-right outline-none border border-slate-200 placeholder:text-slate-400"
          />
          <button
            onClick={() => void handleSend()}
            disabled={chatLoading || !userInput.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform cursor-pointer font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
              color: 'white',
              opacity: chatLoading || !userInput.trim() ? 0.5 : 1,
            }}
          >
            ↑
          </button>
        </div>
      </div>
      <BottomNav active="ai_lesson" />
    </div>
  );
}