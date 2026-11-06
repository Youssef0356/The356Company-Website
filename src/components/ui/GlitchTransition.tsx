import { FC } from 'react';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const GlitchTransition: FC = () => {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Activates near the end of the scroll runway (0.78 -> 1.00)
  const isTransitioning = scrollProgress >= 0.78 && scrollProgress <= 1.0;

  if (!isTransitioning) return null;

  // Normalized transition progress (0 to 1)
  const t = (scrollProgress - 0.78) / 0.22;

  // Dynamic glitch slice offsets
  const slice1X = Math.sin(t * Math.PI * 6) * 85 * t;
  const slice2X = -Math.cos(t * Math.PI * 5) * 105 * t;
  const slice3X = Math.sin(t * Math.PI * 7) * 70 * t;

  // Bell-curve opacity
  const opacity = Math.sin(t * Math.PI);

  return (
    <div
      style={{
        opacity,
        pointerEvents: 'none',
      }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-75"
    >
      {/* Glitch Slices */}
      <div className="relative w-full text-center flex flex-col items-center justify-center">
        {/* Slice 1: Upper band */}
        <div
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 35%)',
            transform: `translateX(${slice1X}px)`,
          }}
          className="w-full text-center"
        >
          <span className="text-[16vw] font-black tracking-tighter leading-none text-white/90 drop-shadow-[0_0_30px_rgba(220,176,255,0.6)]">
            TRANSIT // 01
          </span>
        </div>

        {/* Slice 2: Middle band */}
        <div
          style={{
            clipPath: 'polygon(0 35%, 100% 35%, 100% 68%, 0 68%)',
            transform: `translateX(${slice2X}px)`,
          }}
          className="absolute inset-0 w-full text-center"
        >
          <span className="text-[16vw] font-black tracking-tighter leading-none text-[#00E5FF] mix-blend-screen opacity-85">
            TRANSIT // 01
          </span>
        </div>

        {/* Slice 3: Lower band */}
        <div
          style={{
            clipPath: 'polygon(0 68%, 100% 68%, 100% 100%, 0 100%)',
            transform: `translateX(${slice3X}px)`,
          }}
          className="absolute inset-0 w-full text-center"
        >
          <span className="text-[16vw] font-black tracking-tighter leading-none text-[#DCB0FF]/90">
            TRANSIT // 01
          </span>
        </div>
      </div>

      {/* High-speed horizontal digital scanlines */}
      <div 
        style={{
          transform: `scaleY(${1 + t * 2})`,
        }}
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(220,176,255,0.12)_5px,transparent_6px)] pointer-events-none" 
      />
    </div>
  );
};
