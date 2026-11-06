import { FC } from 'react';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const StudioIntroOverlay: FC = () => {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Activates once the physical shard wipe covers the screen (p >= 0.86)
  const isVisible = scrollProgress >= 0.86;

  // Normalized progress within the introduction phase (0.86 to 1.0)
  const t = Math.min(1.0, Math.max(0.0, (scrollProgress - 0.86) / 0.14));

  if (!isVisible && t <= 0) return null;

  return (
    <div
      style={{
        opacity: t,
        pointerEvents: t > 0.5 ? 'auto' : 'none',
      }}
      className="fixed inset-0 z-40 bg-[#05020A] flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 transition-opacity duration-300 select-none"
    >
      {/* Cinematic Studio Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(44,17,95,0.45)_0%,rgba(5,2,10,0.95)_75%)]" />

      {/* Content Container */}
      <div 
        style={{
          transform: `translateY(${(1.0 - t) * 40}px)`,
        }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center transition-transform duration-300"
      >
        {/* Monogram Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DCB0FF] animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/70">
            STUDIO MANIFESTO // 01
          </span>
        </div>

        {/* Master Editorial Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white mb-6">
          We Craft Experiences With{' '}
          <span className="bg-gradient-to-r from-white via-[#DCB0FF] to-[#8C3BE2] bg-clip-text text-transparent">
            Uncompromising Ambition.
          </span>
        </h1>

        {/* Studio Ethos Body */}
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-light max-w-2xl leading-relaxed mb-12">
          The356Company is an independent software and game development studio. 
          We engineer high-performance spatial engines, tactile social deduction worlds, 
          and cross-platform applications built for longevity.
        </p>

        {/* 4 Flagship Products Pillar Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mb-12">
          {[
            { tag: '01', name: 'PAGELIT', desc: 'Android PDF Reader' },
            { tag: '02', name: 'AR EXPLORER', desc: 'Spatial Exploration' },
            { tag: '03', name: 'THE SYSTEM', desc: 'Social Deduction' },
            { tag: '04', name: 'BATTLE COWS', desc: 'Hex Tactical Board' },
          ].map((item) => (
            <div
              key={item.tag}
              className="group p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-left transition-all duration-300 hover:border-[#DCB0FF]/40 hover:bg-white/[0.05]"
            >
              <span className="block text-[10px] font-mono text-[#DCB0FF]/70 tracking-widest mb-1">
                {item.tag} // APP
              </span>
              <span className="block text-sm font-bold tracking-wide text-white mb-0.5">
                {item.name}
              </span>
              <span className="block text-[11px] text-white/40 font-mono">
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Minimal Scroll / Action Cue */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-white/40">
          <span className="w-8 h-[1px] bg-white/20" />
          <span>SCROLL DOWN TO EXPLORE EXHIBITION</span>
          <span className="w-8 h-[1px] bg-white/20" />
        </div>
      </div>
    </div>
  );
};
