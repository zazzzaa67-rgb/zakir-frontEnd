import { useNavigate, useLocation } from 'react-router-dom';

type HomeworkQuestion = {
  question?: string;
  options?: string[];
};

interface LocationState {
  lesson?: string;
  lessonId?: string;
  questions?: HomeworkQuestion[];
}

export default function HomeworkScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const questions = state.questions ?? [];
  const lesson = state.lesson || 'الدرس';
  const lessonId = state.lessonId;

  return (
    <div className="flex h-full w-full flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div className="px-5 pb-5 pt-12" style={{ background: 'linear-gradient(160deg, #F97316 0%, #C2410C 100%)' }}>
        <button
          onClick={() => navigate('/ai-lesson', { state: { lesson, lessonId } })}
          className="mb-4 rounded-full bg-white/20 px-3 py-2 text-white cursor-pointer active:scale-95 transition-transform"
        >
          رجوع
        </button>
        <h1 className="text-right text-2xl font-black text-white">واجب الدرس 📝</h1>
        <p className="mt-1 text-right text-sm font-medium text-orange-100">{lesson} • {questions.length || 15} سؤال</p>
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {questions.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center text-slate-600 shadow-sm">
            الواجب جاهز وسيظهر هنا بعد تحميل محتوى الدرس.
          </div>
        ) : (
          questions.map((item, index) => (
            <div key={index} className="mb-3 rounded-2xl bg-white p-4 text-right shadow-sm">
              <div className="mb-3 font-black text-slate-900">{index + 1}. {item.question}</div>
              <div className="flex flex-col gap-2">
                {(item.options ?? []).map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-right text-sm font-medium text-slate-700 active:bg-orange-50 active:border-orange-200 transition-colors cursor-pointer"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}