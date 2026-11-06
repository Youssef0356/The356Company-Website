import { FC, useState } from 'react';
import { SceneManager } from '@/components/canvas/SceneManager';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollPrompt } from '@/components/ui/ScrollPrompt';
import { StudioIntroOverlay } from '@/components/ui/StudioIntroOverlay';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { useMasterTimeline } from '@/hooks/useMasterTimeline';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const App: FC = () => {
  // Initialize Lenis smooth scroll and GSAP master scroll timeline
  useLenisScroll();
  useMasterTimeline();

  const [isCalibrated, setIsCalibrated] = useState(false);
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Subtitle fades in as colors awaken (0.08 -> 0.32), fades out as camera dollies to left element (0.35 -> 0.45)
  const subtitleOpacity =
    scrollProgress < 0.08
      ? 0
      : scrollProgress <= 0.35
      ? Math.min(1.0, (scrollProgress - 0.08) / 0.16)
      : Math.max(0, 1.0 - (scrollProgress - 0.35) / 0.12);

  // Massive background typography fades slightly as camera dollies
  const bgTextOpacity =
    scrollProgress <= 0.35
      ? 0.08
      : Math.max(0, 0.08 * (1.0 - (scrollProgress - 0.35) / 0.25));

  return (
    <div className="relative min-h-screen bg-[#05020A] text-white selection:bg-[#DCB0FF] selection:text-[#2C115F] overflow-x-hidden">
      {/* 0. Pure Opaque Sacred Geometry Preloader */}
      <Preloader onComplete={() => setIsCalibrated(true)} />

      {/* 1. Subtle Cinematic CRT Scanline Matrix */}
      <div 
        className="fixed inset-0 pointer-events-none z-20 opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" 
      />

      {/* 2. Bespoke Magnetic Cursor */}
      <CustomCursor />

      {/* 3. Persistent 3D Master Stage (Studio Core, Laptop, Phone, Rings & Shards) */}
      <SceneManager />

      {/* 4. Minimalist Corner Telemetry (Clean, No Clutter) */}
      <div className="fixed top-8 left-8 sm:left-12 z-30 flex items-center gap-3 text-[11px] font-mono tracking-widest uppercase text-white/50 pointer-events-none select-none">
        <span className="w-2 h-2 rounded-full bg-[#DCB0FF] animate-ping" />
        <span className="font-bold text-white tracking-widest">THE356COMPANY</span>
        <span className="text-white/20">/</span>
        <span className="text-white/40">STUDIO EXHIBITION</span>
      </div>

      <div className="fixed top-8 right-8 sm:right-12 z-30 text-[11px] font-mono tracking-widest text-white/40 pointer-events-none select-none">
        [SYS.01 // ZERO-G]
      </div>

      {/* 5. Minimalist [scroll down] HUD Prompt */}
      <ScrollPrompt />

      {/* 6. Studio Introduction Overlay (Revealed seamlessly on shard blackout at p >= 0.86) */}
      <StudioIntroOverlay />

      {/* 7. CINEMATIC SCROLL RUNWAY (500vh Continuous Experience) */}
      <main className={`relative z-10 w-full transition-opacity duration-1000 ${isCalibrated ? 'opacity-100' : 'opacity-0'}`}>
        <section
          id="hero"
          className="relative h-[500vh] w-full"
        >
          {/* Sticky Fullscreen HUD Frame */}
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none">
            
            {/* Monumental Background Typography (Behind 3D Scene in Depth) */}
            <div 
              style={{ opacity: bgTextOpacity }}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            >
              <span className="text-[20vw] font-black tracking-tighter leading-none text-white whitespace-nowrap select-none drop-shadow-2xl">
                THE 356
              </span>
            </div>

            {/* Clean Architectural Subtitle (Fades in right above Medallion as colors awaken) */}
            <div
              style={{
                opacity: subtitleOpacity,
                transform: `translateY(${(1.0 - subtitleOpacity) * 15}px)`,
              }}
              className="absolute top-[22vh] sm:top-[20vh] text-center transition-all duration-300"
            >
              <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.35em] uppercase text-white/75">
                Software. Games. Spatial Dimensions.
              </p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
