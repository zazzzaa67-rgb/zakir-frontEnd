import { NavProps } from '../App';

const STARS = [
  { top: '8%', left: '12%', size: 3, delay: '0s' },
  { top: '15%', left: '78%', size: 2, delay: '0.5s' },
  { top: '22%', left: '45%', size: 4, delay: '1s' },
  { top: '35%', left: '88%', size: 2, delay: '1.5s' },
  { top: '10%', left: '60%', size: 3, delay: '0.3s' },
  { top: '55%', left: '5%', size: 2, delay: '0.8s' },
  { top: '65%', left: '90%', size: 3, delay: '1.2s' },
  { top: '75%', left: '25%', size: 2, delay: '0.6s' },
  { top: '85%', left: '70%', size: 4, delay: '1.8s' },
  { top: '45%', left: '95%', size: 2, delay: '0.4s' },
  { top: '30%', left: '8%', size: 3, delay: '1.1s' },
  { top: '90%', left: '40%', size: 2, delay: '0.9s' },
];

export default function SplashScreen({ navigate }: NavProps) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #0A1628 0%, #0D2356 40%, #1A3A8F 70%, #1E6FF0 100%)' }}
    >
      {/* Stars */}
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            opacity: 0.7,
            animation: `pulse ${1.5 + parseFloat(s.delay)}s ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Glowing orb behind illustration */}
      <div
        className="absolute rounded-full"
        style={{
          width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)',
        }}
      />

      {/* Illustration cluster */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Central AI orb */}
        <div
          className="w-36 h-36 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            border: '2px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 60px rgba(30,111,240,0.4), inset 0 0 30px rgba(255,255,255,0.05)',
          }}
        >
          <span className="text-6xl" style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6))' }}>🤖</span>
        </div>

        {/* Floating badge: Book */}
        <div
          className="absolute -top-5 -right-5 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #F97316)',
            boxShadow: '0 4px 16px rgba(245,158,11,0.5)',
            animation: 'bounce 2s ease-in-out infinite',
          }}
        >
          📚
        </div>

        {/* Floating badge: Lightbulb */}
        <div
          className="absolute -bottom-3 -left-5 w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            boxShadow: '0 4px 16px rgba(124,58,237,0.5)',
            animation: 'pulse 2.5s ease-in-out infinite',
          }}
        >
          💡
        </div>

        {/* Floating badge: Star */}
        <div
          className="absolute top-2 -left-6 w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            boxShadow: '0 4px 12px rgba(16,185,129,0.5)',
            animation: 'bounce 3s ease-in-out 0.5s infinite',
          }}
        >
          ⭐
        </div>
      </div>

      {/* App name */}
      <h1
        className="text-5xl font-black text-white mb-3 tracking-tight"
        style={{ textShadow: '0 0 40px rgba(30,111,240,0.8), 0 4px 20px rgba(0,0,0,0.3)' }}
      >
        ذاكر معي
      </h1>

      {/* Tagline */}
      <p className="text-center text-white/60 text-sm px-12 mb-16 leading-relaxed font-medium">
        افهمها، ذاكرها، وخلّي مستواك يتكلم عنك.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('onboarding')}
        className="active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #e8f0ff 100%)',
          color: '#1E6FF0',
          fontWeight: 800,
          fontSize: 18,
          paddingInline: 52,
          paddingBlock: 16,
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(30,111,240,0.4), 0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        ابدأ رحلتك ✨
      </button>

      {/* Bottom indicator dots */}
      <div className="absolute bottom-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i === 0 ? 24 : 6,
              height: 6,
              background: i === 0 ? '#1E6FF0' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
