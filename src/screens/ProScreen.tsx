import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  { icon: '📚', text: 'عدد كبير جدًا من الدروس بدون إعلانات' },
  { icon: '📅', text: 'جدول مذاكرة شخصي' },
  { icon: '🔔', text: 'تذكيرات ذكية' },
  { icon: '📊', text: 'إحصائيات متتقدمة' },
  { icon: '❌', text: 'مراجعة الأخطاء' },
  { icon: '🎯', text: 'تجربة تعلم أكثر تخصيصًا' },
  { icon: '🤖', text: 'مزايا AI إضافية' },
];

const plans = [
  { id: 'monthly', label: 'شهري', price: '29', unit: 'جنيه/شهر', badge: '', savings: '' },
  { id: 'yearly', label: 'سنوي', price: '199', unit: 'جنيه/سنة', badge: 'الأوفر', savings: 'وفّر 47%' },
];

export default function ProScreen() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly'); // اختيار الخطة السنوية كافتراضي

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F4FF]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A0F1E 0%, #1E1B4B 50%, #312E81 100%)' }}
      >
        {/* Star decorations */}
        {[
          { top: '15%', left: '10%' },
          { top: '25%', left: '85%' },
          { top: '55%', left: '5%' },
          { top: '40%', left: '92%' },
        ].map((pos, i) => (
          <div key={i} className="absolute text-amber-400 text-lg opacity-60" style={{ top: pos.top, left: pos.left }}>
            ⭐
          </div>
        ))}

        <div className="flex items-center justify-between mb-5">
          <div />
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-white font-bold">×</span>
          </button>
        </div>

        <div className="text-center">
          <div
            className="text-sm font-black px-4 py-1.5 rounded-full inline-block mb-3"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', color: 'white' }}
          >
            🚀 فهمتها PRO
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            ذاكر أكتر،{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ركّز أكتر
            </span>
          </h1>
          <p className="text-indigo-300 text-sm font-medium">ووصل لهدفك أسرع.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24">
        {/* Benefits list */}
        <div className="bg-white rounded-2xl p-5 mb-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-slate-900 font-black text-lg mb-4 text-right">مميزات PRO</h2>
          <div className="flex flex-col gap-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 justify-end">
                <span className="text-slate-700 text-sm font-semibold text-right flex-1">{b.text}</span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}
                >
                  {b.icon}
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500">
                  <span className="text-white text-[10px] font-black">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing plans */}
        <h2 className="text-slate-900 font-black text-lg mb-3 text-right">اختار خطتك</h2>
        <div className="flex flex-col gap-3 mb-5">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className="rounded-2xl p-5 relative cursor-pointer transition-all active:scale-98"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #1E1B4B, #312E81)'
                    : 'white',
                  border: isSelected ? '2px solid #F59E0B' : '1.5px solid #E2E8F0',
                  boxShadow: isSelected
                    ? '0 8px 32px rgba(49,46,129,0.3)'
                    : '0 2px 10px rgba(0,0,0,0.05)',
                }}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-2.5 left-5 px-3 py-1 rounded-full text-xs font-black"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', color: 'white' }}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    {plan.savings && (
                      <div
                        className="text-xs font-black px-2 py-0.5 rounded-lg mb-1 inline-block"
                        style={{ background: '#F0FDF4', color: '#10B981' }}
                      >
                        {plan.savings}
                      </div>
                    )}
                    <div className="flex items-end gap-1">
                      <span
                        className="text-3xl font-black"
                        style={{ color: isSelected ? 'white' : '#0F172A' }}
                      >
                        {plan.price}
                      </span>
                      <span
                        className="text-sm font-medium mb-1"
                        style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : '#94A3B8' }}
                      >
                        {plan.unit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-lg font-black"
                      style={{ color: isSelected ? 'white' : '#0F172A' }}
                    >
                      {plan.label}
                    </div>
                    <div
                      className="text-xs font-medium mt-0.5"
                      style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}
                    >
                      وصول كامل لكل المميزات
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/pro-dashboard', { state: { plan: selectedPlan } })}
          className="w-full py-4 rounded-2xl text-white font-black text-lg active:scale-95 transition-transform mb-3 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 50%, #EF4444 100%)',
            boxShadow: '0 8px 32px rgba(245,158,11,0.5)',
          }}
        >
          اشترك في PRO 🚀
        </button>

        <p className="text-center text-slate-400 text-xs font-medium">
          يمكن إلغاء الاشتراك في أي وقت • لا توجد رسوم خفية
        </p>
      </div>
    </div>
  );
}