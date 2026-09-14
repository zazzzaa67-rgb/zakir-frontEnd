import { useEffect, useState } from 'react';
import { NavProps } from '../App';
import BottomNav from '../components/BottomNav';
import { askLessonAI, getLessonById, LessonDetails } from '../lib/api';

const modes = [
  { icon: '📄', label: 'ملف الدرس PDF', screen: 'pdf' as const },
  { icon: '📝', label: 'واجب الدرس', screen: 'homework' as const },
  { icon: '🧠', label: 'امتحان الدرس', screen: 'quiz' as const },
];

const aiMessages = [
  "أهلاً! أنا هنا أشرحلك درس المعادلات الخطية بطريقة بسيطة 🤖",
  "المعادلة الخطية هي معادلة بتتكون من متغير واحد مرفوع للأس الأول. الشكل العام: ax + b = c",
  "فهمت الجزئية دي؟",
];

export default function AILessonScreen({ navigate, params }: NavProps) {
  const lesson = (params?.lesson as string) || 'المعادلات الخطية';
  const lessonId = params?.lessonId as string | undefined;
  const [lessonDetails, setLessonDetails] = useState<LessonDetails | null>(null);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState(aiMessages);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  useEffect(() => {
    if (!lessonId) return;
    getLessonById(lessonId).then(setLessonDetails).catch(() => undefined);
  }, [lessonId]);

  const openMode = (mode: typeof modes[number]) => {
    if (mode.screen === 'pdf') {
      const pdfUrl = lessonDetails?.books?.source_url;
      if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      else setChatError('ملف PDF لهذا الدرس غير متاح حاليا');
      return;
    }
    navigate(mode.screen, {
      lessonId,
      lesson,
      questions: mode.screen === 'homework' ? lessonDetails?.content_json.homework : lessonDetails?.content_json.exam,
    });
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    if (!lessonId) {
      setChatError('افتح المحادثة من درس محدد حتى أقدر أجاوب من محتواه');
      return;
    }
    const message = userInput.trim();
    const history = messages.map((item) => ({
      role: item.startsWith('أنت:') ? 'user' as const : 'model' as const,
      text: item.replace(/^أنت:\s*/, ''),
    }));
    setMessages((current) => [...current, `أنت: ${message}`]);
    setUserInput('');
    setChatError('');
    setChatLoading(true);
    try {
      const result = await askLessonAI(lessonId, message, history);
      setMessages((current) => [...current, result.answer]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'تعذر تشغيل مساعد الدرس');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D2356 0%, #1E1B4B 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {modes.map((m) => (
              <button
                key={m.label}
                onClick={() => openMode(m)}
                className="text-base px-2 py-1.5 rounded-xl bg-white/10 text-white active:bg-white/20"
                title={m.label}
              >
                {m.icon}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('lesson_list')} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <span className="text-white font-bold">→</span>
          </button>
        </div>
        <h1 className="text-xl font-black text-white text-right">ذاكر معي 🤖</h1>
        <p className="text-blue-300 text-sm font-medium text-right mt-0.5">{lesson}</p>
      </div>

      {/* AI Tutor visual + mode cards */}
      <div className="px-5 py-4">
        {/* AI Avatar */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4 mb-4"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
            boxShadow: '0 4px 20px rgba(49,46,129,0.3)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
              boxShadow: '0 4px 16px rgba(30,111,240,0.4)',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          >
            🤖
          </div>
          <div className="text-right flex-1">
            <div className="text-white font-black text-base">مساعد ذاكر معي</div>
            <div className="text-indigo-300 text-xs font-medium mt-0.5">جاهز أشرحلك الدرس بطريقتك</div>
            <div className="flex items-center gap-1.5 justify-end mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-semibold">نشط الآن</span>
            </div>
          </div>
        </div>

        {/* Mode cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {modes.map((m) => (
            <button
              key={m.label}
              onClick={() => openMode(m)}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>
        {chatError && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-right text-sm font-bold text-red-600">{chatError}</div>}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-5 pb-2">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => {
            const isUser = msg.startsWith('أنت:');
            return (
              <div key={i} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                {!isUser && (
                  <div className="flex items-end gap-2 max-w-[85%]">
                    <div
                      className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm font-medium leading-relaxed"
                      style={{
                        background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
                        color: 'white',
                      }}
                    >
                      {msg}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-sm flex-shrink-0">
                      🤖
                    </div>
                  </div>
                )}
                {isUser && (
                  <div
                    className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 text-sm font-medium"
                    style={{ background: '#E2E8F0', color: '#0F172A' }}
                  >
                    {msg.replace('أنت: ', '')}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick response buttons */}
          <div className="flex flex-wrap gap-2 justify-end mt-1">
            {[
              { label: '👍 أيوه فهمت', action: () => setUserInput('اديني مثال كمان من الدرس') },
              { label: '🤔 اشرحها تاني', action: () => setUserInput('اشرح النقطة دي بطريقة أبسط') },
              { label: '❓ عندي سؤال', action: () => setUserInput('') },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                style={{
                  background: 'white',
                  color: '#1E6FF0',
                  border: '1.5px solid #DBEAFE',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="px-5 pb-24 pt-3 bg-white border-t border-slate-100">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => void handleSend()}
            disabled={chatLoading || !userInput.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)', color: 'white', opacity: chatLoading || !userInput.trim() ? 0.5 : 1 }}
          >
            ↑
          </button>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
            placeholder="اسألني أي سؤال عن الدرس..."
            className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 text-right outline-none border border-slate-200 placeholder:text-slate-400"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          />
        </div>
        {chatLoading && <p className="mt-2 text-right text-xs font-bold text-blue-600">مساعد الدرس بيجهز الإجابة...</p>}
      </div>

      <BottomNav active="ai_lesson" navigate={navigate} />
    </div>
  );
}
