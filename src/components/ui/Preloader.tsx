import { FC, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isExited, setIsExited] = useState(false);

  useEffect(() => {
    // Lock scroll during loading
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.max(1, Math.floor(Math.random() * 8) + (prev > 75 ? 6 : 3));
        return Math.min(100, prev + step);
      });
    }, 35);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setIsDone(true);
      }, 300);

      const finishTimer = setTimeout(() => {
        setIsExited(true);
        document.body.style.overflow = '';
        ScrollTrigger.refresh();
        onComplete?.();
      }, 850);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [progress, onComplete]);

  if (isExited) return null;

  return (
    <div
      id="preloader"
      style={{
        zIndex: 99999,
      }}
      className={`fixed inset-0 flex flex-col justify-between p-8 sm:p-14 bg-[#05020A] text-white select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDone ? 'opacity-0 scale-105 pointer-events-none filter blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Bar: Minimal Telemetry */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-white/40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DCB0FF] animate-pulse" />
          <span>SYSTEM CALIBRATION // 356</span>
        </div>
        <div>STATION 00: OBSIDIAN CORE</div>
      </div>

      {/* Center: The Sacred Geometry Diagram (3 Harmonic Orbits: 3 : 5 : 6) */}
      <div className="relative self-center my-auto flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          <div className="absolute inset-0 border border-white/10 rounded-2xl" />
          
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full p-4 overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Orbit (Radius 6 Harmonic) */}
            <circle
              cx="100"
              cy="100"
              r="84"
              stroke="#DCB0FF"
              strokeWidth="0.8"
              strokeOpacity="0.4"
              strokeDasharray="3 4"
              className="animate-[spin_40s_linear_infinite]"
            />

            {/* Middle Orbit (Radius 5 Harmonic) */}
            <circle
              cx="100"
              cy="100"
              r="70"
              stroke="#FFFFFF"
              strokeWidth="0.6"
              strokeOpacity="0.3"
            />

            {/* Inner Orbit (Radius 3 Harmonic) */}
            <circle
              cx="100"
              cy="100"
              r="42"
              stroke="#00E5FF"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />

            {/* Kepler Golden Harmonic Spiral Line */}
            <path
              d="M 100 16 A 84 84 0 0 1 184 100 A 70 70 0 0 1 114 170 A 42 42 0 0 1 72 128 A 20 20 0 0 1 92 108"
              stroke="#DCB0FF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="400"
              strokeDashoffset={400 - (progress / 100) * 400}
              className="transition-[stroke-dashoffset] duration-75 ease-out"
            />

            {/* Orbital Harmonic Markers */}
            <circle cx="100" cy="58" r="2.5" fill="#00E5FF" />
            <circle cx="170" cy="100" r="2.5" fill="#FFFFFF" />
            <circle cx="100" cy="184" r="3" fill="#DCB0FF" />

            <line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="0.4" strokeOpacity="0.15" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="white" strokeWidth="0.4" strokeOpacity="0.15" />
          </svg>

          {/* Center Loading Status & Live Progress */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-mono tracking-widest text-white/50 lowercase">
              calibrating antigravity.
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tighter mt-1">
              {progress}%
            </span>
          </div>

          <div className="absolute -right-7 sm:-right-8 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-mono tracking-wider text-white/35 whitespace-nowrap">
            r₁/3 = r₂/5 = r₃/6 ≈ 1.618
          </div>
        </div>
      </div>

      {/* Bottom Bar: Studio Manifesto Quote */}
      <div className="max-w-md">
        <p className="text-sm sm:text-base font-light text-white/90 leading-snug">
          “In zero gravity, every direction is an invitation to build.”
        </p>
        <span className="block mt-2 text-xs font-mono tracking-wider text-[#DCB0FF]/70">
          — The356Company Studio Manifesto
        </span>
      </div>
    </div>
  );
};
