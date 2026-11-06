import { FC } from 'react';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const ScrollPrompt: FC = () => {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Smoothly fade out as soon as the user starts scrolling
  const isVisible = scrollProgress < 0.04;

  return (
    <div
      className={`fixed bottom-8 right-8 z-30 pointer-events-none flex flex-col items-center gap-2.5 transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Animated Mouse Capsule Glyph */}
      <div className="relative w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1 backdrop-blur-sm bg-black/20">
        <div className="w-1 h-2 rounded-full bg-[#DCB0FF] animate-[bounce_1.6s_ease-in-out_infinite]" />
      </div>

      {/* Technical Text Label */}
      <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 select-none">
        [scroll down]
      </span>
    </div>
  );
};
