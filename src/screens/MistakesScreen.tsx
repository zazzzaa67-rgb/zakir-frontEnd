import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudyNote, deleteStudyNote, getStoredMistakes, getStoredNotes } from '../lib/mistakeStore';

const mistakes = [
  {
    subject: 'الرياضيات',
    lesson: 'المعادلات الخطية',
    question: 'لو 2x + 6 = 14، إيه قيمة x؟',
    yourAnswer: 'x = 2',
    correct: 'x = 4',
    date: 'أمس',
  },
  {
    subject: 'العلوم',
    lesson: 'الحركة والقوة',
    question: 'إيه وحدة قياس القوة في النظام الدولي؟',
    yourAnswer: 'كيلوجرام',
    correct: 'نيوتن',
    date: 'منذ يومين',
  },
  {
    subject: 'اللغة العربية',
    lesson: 'النحو والصرف',
    question: 'ما علامة رفع جمع المذكر السالم؟',
    yourAnswer: 'الضمة',
    correct: 'الواو',
    date: 'منذ 3 أيام',
  },
];

const notes = [
  { subject: 'الرياضيات', content: 'المعادلة الخطية: ax + b = c → x = (c-b)/a', date: 'اليوم' },
  { subject: 'العلوم', content: 'قانون نيوتن الثاني: F = m × a', date: 'أمس' },
];

const pendingQuestions = [
  { subject: 'الرياضيات', question: 'إيه الفرق بين المعادلة والمتباينة؟' },
  { subject: 'الفيزياء', question: 'لماذا تختلف درجة انصهار المواد؟' },
];

const tabs = ['❌ أخطائي', '📝 ملاحظاتي', '📌 أسئلة متبقية'];

export default function MistakesScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [mistakes, setMistakes] = useState(getStoredMistakes);
  const [notes, setNotes] = useState(getStoredNotes);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteSubject, setNoteSubject] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!noteSubject.trim() || !noteContent.trim()) return;
    addStudyNote(noteSubject.trim(), noteContent.trim());
    setNotes(getStoredNotes());
    setNoteSubject('');
    setNoteContent('');
    setShowNoteForm(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5' }}
          >
            {mistakes.length} خطأ
          </div>
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-white font-bold">→</span>
          </button>
        </div>
        <h1 className="text-2xl font-black text-white text-right mb-1">أخطائي وملاحظاتي</h1>
        <p className="text-slate-400 text-sm font-medium text-right">قاعدة معرفتك الشخصية</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-100">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className="flex-1 py-3 text-xs font-bold transition-colors text-center cursor-pointer"
            style={{
              color: activeTab === i ? '#1E6FF0' : '#94A3B8',
              borderBottom: activeTab === i ? '2px solid #1E6FF0' : '2px solid transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
        {activeTab === 0 && (
          <div className="flex flex-col gap-4">
            {mistakes.map((m, i) => (
              <div
                key={m.id || i}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                  <span className="text-xs text-slate-400 font-medium">{m.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                      {m.subject}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{m.lesson}</span>
                  </div>
                </div>

                <div className="px-4 py-3">
                  <p className="text-slate-800 text-sm font-bold text-right mb-3">{m.question}</p>

                  <div className="flex gap-2 mb-3">
                    <div
                      className="flex-1 rounded-xl p-3 text-right"
                      style={{ background: '#FFF5F5', border: '1px solid #FCA5A5' }}
                    >
                      <div className="text-xs text-red-400 font-semibold mb-1">إجابتك</div>
                      <div className="text-red-700 text-sm font-bold">{m.yourAnswer}</div>
                    </div>
                    <div
                      className="flex-1 rounded-xl p-3 text-right"
                      style={{ background: '#F0FDF4', border: '1px solid #6EE7B7' }}
                    >
                      <div className="text-xs text-green-600 font-semibold mb-1">الإجابة الصح</div>
                      <div className="text-green-700 text-sm font-bold">{m.correct}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/ai-lesson', { state: { lesson: m.lesson } })}
                    className="w-full py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)', color: 'white' }}
                  >
                    ذاكر النقطة دي تاني 🔄
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowNoteForm(true)}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer active:scale-98 transition-transform"
              style={{ background: '#EFF6FF', color: '#1E6FF0', border: '2px dashed #93C5FD' }}
            >
              <span>+</span>
              <span>إضافة ملاحظة جديدة</span>
            </button>

            {notes.map((n, i) => (
              <div
                key={n.id || i}
                className="bg-white rounded-2xl p-4"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    aria-label="حذف الملحوظة"
                    onClick={() => {
                      if (n.id) deleteStudyNote(n.id);
                      setNotes(getStoredNotes());
                    }}
                    className="text-xs text-red-500 font-bold"
                  >
                    حذف
                  </button>
                  <span className="text-xs text-slate-400 font-medium">{n.date}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: '#EFF6FF', color: '#1E6FF0' }}
                  >
                    {n.subject}
                  </span>
                </div>
                <p className="text-slate-700 text-sm font-semibold text-right leading-relaxed">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="flex flex-col gap-3">
            {pendingQuestions.map((q, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: '#FFF7ED', color: '#F97316' }}
                  >
                    {q.subject}
                  </span>
                  <span className="text-yellow-500 text-base">📌</span>
                </div>
                <p className="text-slate-700 text-sm font-semibold text-right mb-3">{q.question}</p>
                <button
                  onClick={() => navigate('/ai-lesson')}
                  className="w-full py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)', color: 'white' }}
                >
                  اسأل AI 🤖
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {showNoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAddNote} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-right text-lg font-black text-slate-900">إضافة ملحوظة</h2>
            <input
              autoFocus
              value={noteSubject}
              onChange={(event) => setNoteSubject(event.target.value)}
              placeholder="المادة أو عنوان الملحوظة"
              className="mb-3 w-full rounded-xl border border-slate-200 p-3 text-right text-sm"
              required
            />
            <textarea
              value={noteContent}
              onChange={(event) => setNoteContent(event.target.value)}
              placeholder="اكتب ملحوظتك هنا"
              className="min-h-28 w-full rounded-xl border border-slate-200 p-3 text-right text-sm"
              required
            />
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setShowNoteForm(false)} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600">إلغاء</button>
              <button type="submit" className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white">حفظ الملحوظة</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
