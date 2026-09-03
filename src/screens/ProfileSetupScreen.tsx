import { useState } from 'react';
import { NavProps } from '../App';

const stages = ['ابتدائي', 'إعدادي', 'ثانوي'];

const gradesByStage: Record<string, string[]> = {
  'ابتدائي': ['رابعة ابتدائي', 'خامسة ابتدائي', 'سادسة ابتدائي'],
  'إعدادي': ['أولى إعدادي', 'ثانية إعدادي', 'ثالثة إعدادي'],
  'ثانوي': ['أولى ثانوي', 'ثانية ثانوي', 'ثالثة ثانوي'],
};

const subjects = [
  { icon: '📐', name: 'الرياضيات' },
  { icon: '🔬', name: 'العلوم' },
  { icon: '📖', name: 'اللغة العربية' },
  { icon: '🇬🇧', name: 'اللغة الإنجليزية' },
  { icon: '🌍', name: 'الدراسات الاجتماعية' },
  { icon: '⚛️', name: 'الفيزياء' },
  { icon: '🧪', name: 'الكيمياء' },
  { icon: '🧬', name: 'الأحياء' },
];

export default function ProfileSetupScreen({ navigate }: NavProps) {
  const [step, setStep] = useState(0);
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (name: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const canProceed = () => {
    if (step === 0) return selectedStage !== '';
    if (step === 1) return selectedGrade !== '';
    return selectedSubjects.length > 0;
  };

  const stepLabels = ['المرحلة', 'الصف', 'المواد'];

  return (
    <div className="w-full h-full flex flex-col bg-[#F8F9FF]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex gap-2 mb-6">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-1.5 rounded-full transition-colors"
                style={{ background: i <= step ? '#1E6FF0' : '#E2E8F0' }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: i <= step ? '#1E6FF0' : '#94A3B8' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-1">
          {step === 0 && 'اختار مرحلتك الدراسية'}
          {step === 1 && 'اختار صفك الدراسي'}
          {step === 2 && 'اختار مواد مفضلة'}
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          {step === 0 && 'هنخصصلك المحتوى المناسب'}
          {step === 1 && 'عشان نجيبلك الدروس الصح'}
          {step === 2 && 'ممكن تختار أكتر من مادة'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {step === 0 && (
          <div className="flex flex-col gap-3">
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className="w-full py-5 px-6 rounded-2xl text-right font-bold text-lg transition-all active:scale-95 flex items-center justify-between"
                style={{
                  background: selectedStage === stage
                    ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
                    : 'white',
                  border: `2px solid ${selectedStage === stage ? '#1E6FF0' : '#F1F5F9'}`,
                  color: selectedStage === stage ? '#1E6FF0' : '#0F172A',
                  boxShadow: selectedStage === stage
                    ? '0 4px 16px rgba(30,111,240,0.15)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <span>
                  {stage === 'ابتدائي' && '🏫'}
                  {stage === 'إعدادي' && '📚'}
                  {stage === 'ثانوي' && '🎓'}
                </span>
                <span>{stage}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-3">
            {(gradesByStage[selectedStage] || []).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className="w-full py-5 px-6 rounded-2xl text-right font-bold text-lg transition-all active:scale-95 flex items-center justify-between"
                style={{
                  background: selectedGrade === grade
                    ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
                    : 'white',
                  border: `2px solid ${selectedGrade === grade ? '#1E6FF0' : '#F1F5F9'}`,
                  color: selectedGrade === grade ? '#1E6FF0' : '#0F172A',
                  boxShadow: selectedGrade === grade
                    ? '0 4px 16px rgba(30,111,240,0.15)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <span>{selectedGrade === grade ? '✓' : ''}</span>
                <span>{grade}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((sub) => {
              const isSelected = selectedSubjects.includes(sub.name);
              return (
                <button
                  key={sub.name}
                  onClick={() => toggleSubject(sub.name)}
                  className="py-5 px-4 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
                      : 'white',
                    border: `2px solid ${isSelected ? '#1E6FF0' : '#F1F5F9'}`,
                    boxShadow: isSelected
                      ? '0 4px 16px rgba(30,111,240,0.15)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <span className="text-3xl">{sub.icon}</span>
                  <span
                    className="text-sm font-bold text-center leading-tight"
                    style={{ color: isSelected ? '#1E6FF0' : '#0F172A' }}
                  >
                    {sub.name}
                  </span>
                  {isSelected && <span className="text-blue-600 text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={() => {
            if (step < 2) setStep(step + 1);
            else navigate('home');
          }}
          disabled={!canProceed()}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-95"
          style={{
            background: canProceed()
              ? 'linear-gradient(135deg, #1E6FF0, #7C3AED)'
              : '#E2E8F0',
            color: canProceed() ? 'white' : '#94A3B8',
            boxShadow: canProceed() ? '0 8px 24px rgba(30,111,240,0.4)' : 'none',
          }}
        >
          {step < 2 ? 'التالي →' : 'ابدأ التعلم 🚀'}
        </button>
      </div>
    </div>
  );
}
