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
  // Debug: expose store for headless testing (remove before production)
  if (typeof window !== 'undefined') {
    (window as any).useExperienceStore = useExperienceStore;
  }
  // Initialize Lenis smooth scroll and GSAP master scroll timeline
  useLenisScroll();
  useMasterTimeline();

  const [isCalibrated, setIsCalibrated] = useState(false);
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Subtitle is visible from start to greet visitor, fades out as camera dollies to phone (0.12 -> 0.18)
  const subtitleOpacity =
    scrollProgress <= 0.12
      ? 0.9
      : Math.max(0, 0.9 * (1.0 - (scrollProgress - 0.12) / 0.06));

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

      {/* 4. Minimalist [scroll down] HUD Prompt */}
      <ScrollPrompt />

      {/* 6. Studio Introduction Overlay (Revealed seamlessly on shard blackout at p >= 0.86) */}
      <StudioIntroOverlay />

      {/* 7. CINEMATIC SCROLL RUNWAY (500vh Continuous Experience) */}
      <main className={`relative z-10 w-full transition-opacity duration-1000 ${isCalibrated ? 'opacity-100' : 'opacity-0'}`}>
        <section
          id="hero"
          className="relative h-[800vh] w-full"
        >
          {/* Sticky Fullscreen HUD Frame */}
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none">
            
            {/* Clean Architectural Subtitle (Positioned cleanly in the upper sky above the Orbital Rings) */}
            <div
              style={{
                opacity: subtitleOpacity,
                transform: `translateY(${(1.0 - subtitleOpacity) * 15}px)`,
              }}
              className="absolute top-[6vh] sm:top-[7vh] text-center transition-all duration-300"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#DCB0FF]/20 bg-[#0D061A]/60 backdrop-blur-md shadow-[0_0_25px_rgba(44,17,95,0.45)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DCB0FF] shadow-[0_0_8px_#DCB0FF] animate-pulse" />
                <p className="text-[11px] sm:text-xs md:text-sm font-light tracking-[0.38em] uppercase text-[#F3E8FF]/85">
                  Software &bull; Games &bull; Spatial Dimensions
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
