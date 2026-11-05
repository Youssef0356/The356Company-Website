import { FC } from 'react';
import { SceneManager } from '@/components/canvas/SceneManager';
import { Navbar } from '@/components/ui/Navbar';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ARExplorerExperience } from '@/components/sections/ARExplorerExperience';
import { PagelitExperience } from '@/components/sections/PagelitExperience';
import { TheSystemExperience } from '@/components/sections/TheSystemExperience';
import { BattleCowsExperience } from '@/components/sections/BattleCowsExperience';
import { StoreBadge } from '@/components/ui/StoreBadge';
import { Footer } from '@/components/ui/Footer';
import { PRODUCTS } from '@/data/products';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { useMasterTimeline } from '@/hooks/useMasterTimeline';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Eye, Flame, Cpu } from 'lucide-react';

export const App: FC = () => {
  // Initialize Lenis smooth scroll and GSAP master scroll timeline
  useLenisScroll();
  useMasterTimeline();

  const setCursorVariant = useExperienceStore((s) => s.setCursorVariant);
  const setCursorText = useExperienceStore((s) => s.setCursorText);

  const arExplorer = PRODUCTS.find((p) => p.id === 'ar-explorer')!;
  const pagelit = PRODUCTS.find((p) => p.id === 'pagelit')!;
  const theSystem = PRODUCTS.find((p) => p.id === 'the-system')!;
  const battleCows = PRODUCTS.find((p) => p.id === 'battle-cows')!;

  return (
    <div className="relative min-h-screen bg-[#07030F] text-white selection:bg-[#DCB0FF] selection:text-[#2C115F]">
      {/* 1. Bespoke Magnetic Cursor */}
      <CustomCursor />

      {/* 2. Persistent Dynamic Three.js Atmospheric Background */}
      <SceneManager />

      {/* 3. Floating Glass Navbar */}
      <Navbar />

      {/* 4. SCROLLABLE DOM CONTENT STAGE WITH SEPARATE ATMOSPHERIC REALMS */}
      <main className="relative z-10 w-full">
        {/* =========================================================================
            SCENE 01: GENESIS / STUDIO HERO (Studio Deep Purple)
            ========================================================================= */}
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center items-center px-6 pt-32 pb-20 text-center max-w-5xl mx-auto"
          style={{
            background: 'radial-gradient(ellipse 90% 75% at 50% 40%, rgba(44,17,95,0.45) 0%, transparent 80%)',
          }}
        >
          {/* Studio Official Brand Medallion */}
          <div className="relative mb-6 group">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-3.5 bg-gradient-to-br from-[#2C115F]/90 to-[#0D051C]/95 border border-[#DCB0FF]/40 shadow-[0_20px_50px_rgba(44,17,95,0.7),0_0_35px_rgba(220,176,255,0.3)] backdrop-blur-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <img
                src="/assets/brand/logo-white.png"
                alt="The356Company Official Logo"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(220,176,255,0.6)]"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase bg-white/5 border border-white/10 text-[#DCB0FF] mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Digital Exhibition & Sensory Showcase
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.06] max-w-4xl">
            We Craft Experiences With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DCB0FF] via-white to-[#00E5FF]">
              Uncompromising Ambition.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/75 max-w-2xl font-light leading-relaxed">
            The356Company is an independent software and game development studio. Explore our four
            published flagship creations celebrating tactile augmented reality, offline privacy, and
            unorthodox indie game design.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <StoreBadge
              platform="google-play"
              url="https://play.google.com/store/apps/developer?id=The356Company"
              variant="solid"
              label="Google Play Studio"
              sublabel="VIEW ALL 4 APPS"
            />
            <a
              href="#ar-explorer"
              onMouseEnter={() => {
                setCursorVariant('hover');
                setCursorText('EXPLORE');
              }}
              onMouseLeave={() => {
                setCursorVariant('default');
                setCursorText('');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-md"
            >
              <span>Explore The 4 Dimensions</span>
              <ArrowRight className="w-4 h-4 text-[#DCB0FF]" />
            </a>
          </div>

          <div className="mt-16 text-xs font-mono uppercase tracking-widest text-white/40 animate-bounce">
            ↓ Scroll To Enter The Worlds
          </div>
        </section>

        {/* =========================================================================
            SCENE 02: AR EXPLORER (Electric Spatial Blue & Laser Cyan)
            ========================================================================= */}
        <ARExplorerExperience product={arExplorer} />

        {/* =========================================================================
            SCENE 03: PAGELIT (Luminous Cyan & Deep Teal)
            ========================================================================= */}
        <PagelitExperience product={pagelit} />

        {/* =========================================================================
            SCENE 04: THE SYSTEM (Noir Table Crimson & Amber Gold)
            ========================================================================= */}
        <TheSystemExperience product={theSystem} />

        {/* =========================================================================
            SCENE 05: BATTLE COWS (Lush Meadow Emerald & Honey)
            ========================================================================= */}
        <BattleCowsExperience product={battleCows} />

        {/* =========================================================================
            SCENE 06: THE CONNECTED CONSTELLATION (Ecosystem Finale)
            ========================================================================= */}
        <section
          id="ecosystem"
          className="min-h-screen flex flex-col justify-center items-center px-6 py-28 text-center max-w-4xl mx-auto space-y-8"
          style={{
            background: 'radial-gradient(ellipse 90% 75% at 50% 50%, rgba(44,17,95,0.5) 0%, transparent 80%)',
          }}
        >
          {/* Studio Brand Icon Node */}
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-2xl p-2.5 bg-gradient-to-br from-[#2C115F] to-[#0D051C] border border-[#DCB0FF]/40 shadow-[0_15px_35px_rgba(44,17,95,0.7),0_0_25px_rgba(220,176,255,0.3)] backdrop-blur-xl flex items-center justify-center">
              <img
                src="/assets/brand/logo-white.png"
                alt="The356Company Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase bg-[#2C115F]/80 border border-[#DCB0FF]/40 text-[#DCB0FF] backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5" />
            The Long-Term Architecture
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            A Gradually Converging Ecosystem.
          </h2>

          <p className="text-lg text-white/75 max-w-2xl mx-auto font-light leading-relaxed">
            While each application and game operates independently today, The356Company's overarching
            ambition is to gradually develop an interconnected digital ecosystem where utility, spatial AR,
            and gaming universes complement one another through companion tools and shared identities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full pt-8 text-left border-t border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Compass className="w-4 h-4 text-[#38BDF8]" />
                <span>Spatial Computing</span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed">Augmenting physical environments with ARCore depth maps.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                <span>100% On-Device</span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed">Privacy-first reading engine with zero background telemetry.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Eye className="w-4 h-4 text-[#F59E0B]" />
                <span>Psychological Play</span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed">Social deduction and strategic bluffing for 2-8 players.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Flame className="w-4 h-4 text-[#10B981]" />
                <span>Hexagonal Strategy</span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed">Turn-based territory conquest in Flutter + Flame 1.36.</p>
            </div>
          </div>

          {/* Master Store Link Hub */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            <StoreBadge
              platform="google-play"
              url="https://play.google.com/store/apps/developer?id=The356Company"
              variant="solid"
              label="Visit Studio on Google Play"
              sublabel="DOWNLOAD ALL 4 CREATIONS"
            />
          </div>
        </section>

        {/* 5. Comprehensive Studio Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default App;
