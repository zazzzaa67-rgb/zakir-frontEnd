import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string;
}

export default function AILessonScreen() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'المعادلة الخطية هي معادلة بتتكون من متغير واحد مرفوع للأس الأول. الشكل العام: ax + b = c',
    },
    {
      id: '2',
      sender: 'ai',
      text: 'فهمت الجزئية دي؟',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // إرسال رسالة نصية أو بصورة
  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() && !selectedImage) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSelectedImage(null);

    // محاكاة رد الـ AI
    setTimeout(() => {
      let replyText = 'تمام! ممتاز جداً. هل تحب ننتقل للنقطة اللي بعدها؟';
      if (text.includes('اشرحها')) {
        replyText = 'ولا يهمك! خليني أشرحهالك بمثال أبسط: لو معاك 2x + 3 = 11، بنطرح 3 من الطرفين الأوّل...';
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: replyText },
      ]);
    }, 1000);
  };

  // رفع صورة
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF] dir-rtl">
      {/* Top Header */}
      <div className="bg-[#1E1B4B] px-5 pt-8 pb-4 flex items-center justify-between text-white">
        <button onClick={() => navigate(-1)} className="text-xl font-bold">
          →
        </button>
        <div className="text-center">
          <h1 className="font-black text-lg">ذاكر معي 🤖</h1>
          <p className="text-xs text-indigo-300">المعادلات الخطية</p>
        </div>
        <div className="w-6" />
      </div>

      {/* AI Assistant Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-200">نشط الآن</span>
            </div>
            <h2 className="font-black text-lg mt-1">مساعد ذاكر معي</h2>
            <p className="text-xs text-blue-100">جاهز أشرحلك الدرس بطريقتك</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            🤖
          </div>
        </div>

        {/* Quick Action Buttons (PDF / Homework / Quiz) */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => navigate(`/lesson-pdf/${lessonId || '1'}`)}
            className="bg-white p-3 rounded-2xl flex flex-col items-center shadow-sm active:scale-95 transition-transform"
          >
            <span className="text-xl mb-1">📄</span>
            <span className="text-xs font-bold text-slate-700">ملف PDF</span>
          </button>
          <button
            onClick={() => navigate('/homework')}
            className="bg-white p-3 rounded-2xl flex flex-col items-center shadow-sm active:scale-95 transition-transform"
          >
            <span className="text-xl mb-1">📝</span>
            <span className="text-xs font-bold text-slate-700">واجب الدرس</span>
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="bg-white p-3 rounded-2xl flex flex-col items-center shadow-sm active:scale-95 transition-transform"
          >
            <span className="text-xl mb-1">🧠</span>
            <span className="text-xs font-bold text-slate-700">امتحان الدرس</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm flex-shrink-0">
              {msg.sender === 'user' ? '👤' : '🤖'}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-sm font-medium ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 shadow-sm rounded-bl-none'
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="مرفق"
                  className="max-w-full h-auto rounded-lg mb-2 border border-black/10"
                />
              )}
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Quick AI Feedback Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 justify-end">
          <button
            onClick={() => handleSend('أيوة فهمت 👍')}
            className="bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            👍 أيوة فهمت
          </button>
          <button
            onClick={() => handleSend('اشرحها تاني 🧐')}
            className="bg-white hover:bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            🧐 اشرحها تاني
          </button>
        </div>
      </div>

      {/* Input Area with Image Attachment */}
      <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
        {selectedImage && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-blue-400">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File Upload Hidden Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Camera / Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-lg active:scale-95 transition-transform flex-shrink-0"
          >
            📷
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسألني أي سؤال عن الدرس..."
            className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-right"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg active:scale-95 transition-transform flex-shrink-0"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}