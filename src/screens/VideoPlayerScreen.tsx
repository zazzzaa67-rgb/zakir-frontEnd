import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VideoPlayerScreen() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(48);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0F1E] relative">
      {/* Video area */}
      <div className="relative" style={{ aspectRatio: '16/9' }}>
        {/* Video placeholder */}
        <div
          className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D2356 0%, #1E1B4B 50%, #312E81 100%)',
          }}
        >
          {/* Decorative grid lines */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-blue-400"
                style={{ top: `${(i + 1) * 16.66}%` }}
              />
            ))}
          </div>

          {/* Math equation visual */}
          <div className="relative z-10 text-center">
            <div
              className="text-3xl font-black text-white mb-2"
              style={{ textShadow: '0 0 20px rgba(30,111,240,0.8)' }}
            >
              2x + 5 = 13
            </div>
            <div className="text-blue-300 text-sm font-medium">→ x = 4</div>
          </div>

          {/* Play/pause button overlay */}
          {!playing && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform active:scale-90"
                style={{
                  background: 'rgba(30,111,240,0.9)',
                  boxShadow: '0 0 40px rgba(30,111,240,0.6)',
                }}
              >
                <span className="text-3xl mr-1 text-white">▶</span>
              </div>
            </button>
          )}
        </div>

        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
          <div className="flex gap-2">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white text-sm cursor-pointer"
            >
              {playing ? '⏸' : '▶'}
            </button>
          </div>
          <button
            onClick={() => navigate('/ai-lesson')}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content below video */}
      <div className="flex-1 bg-[#F8F9FF] flex flex-col overflow-hidden">
        {/* Title & progress */}
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900 text-right mb-1">
            المعادلات الخطية
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm font-medium">12 / 25 دقيقة</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #1E6FF0, #7C3AED)',
                }}
              />
            </div>
            <span className="text-blue-600 text-sm font-bold">{progress}%</span>
          </div>
        </div>

        {/* Simulated progress control */}
        <div className="px-5 py-2">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => {
              const val = +e.target.value;
              setProgress(val);
              if (val >= 100) setShowComplete(true);
            }}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-5 py-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-colors cursor-pointer"
            style={{
              background: showTranscript ? '#EFF6FF' : 'white',
              color: showTranscript ? '#1E6FF0' : '#64748B',
              border: `1.5px solid ${showTranscript ? '#BFDBFE' : '#F1F5F9'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <span>📄</span>
            <span>نص الشرح</span>
          </button>
          <button
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
            style={{
              background: 'white',
              color: '#64748B',
              border: '1.5px solid #F1F5F9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <span>📝</span>
            <span>ملاحظاتي</span>
          </button>
          <button
            onClick={() => navigate('/ai-lesson')}
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(30,111,240,0.3)',
            }}
          >
            <span>🤖</span>
            <span>اسألني</span>
          </button>
        </div>

        {/* Transcript panel */}
        {showTranscript && (
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            <div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              <h3 className="font-black text-slate-900 text-sm mb-3 text-right">
                نص الشرح
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed text-right font-medium">
                المعادلة الخطية هي معادلة من الدرجة الأولى بمتغير واحد أو أكثر.
                الشكل العام هو ax + b = c حيث a وb وc أعداد ثابتة وa ≠ 0. لحل
                المعادلة، نقوم بعزل المتغير x من جهة واحدة...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Completion overlay */}
      {showComplete && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-50"
          style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="bg-white rounded-3xl p-8 mx-8 text-center max-w-sm w-full"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">أحسنت!</h2>
            <p className="text-slate-600 font-medium mb-4">
              خلصت درس المعادلات الخطية
            </p>
            <div
              className="text-3xl font-black mb-6"
              style={{
                background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              +20 Points 🏆
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/quiz')}
                className="w-full py-3.5 rounded-2xl text-white font-bold cursor-pointer active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #1E6FF0, #7C3AED)',
                  boxShadow: '0 8px 24px rgba(30,111,240,0.4)',
                }}
              >
                اختبر نفسك 🧠
              </button>
              <button
                onClick={() => navigate('/summary')}
                className="w-full py-3.5 rounded-2xl font-bold text-blue-600 cursor-pointer active:scale-95 transition-transform"
                style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}
              >
                ملخص الدرس 📝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}