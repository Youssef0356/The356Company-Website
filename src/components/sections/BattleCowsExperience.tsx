import { FC, useState, useEffect, useRef } from 'react';
import { ProductData } from '@/data/products';
import { StoreBadge } from '@/components/ui/StoreBadge';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { Trophy, Sparkles, ChevronLeft, ChevronRight, Zap, Target, Flag } from 'lucide-react';

interface BattleCowsExperienceProps {
  product: ProductData;
}

export const BattleCowsExperience: FC<BattleCowsExperienceProps> = ({ product }) => {
  const [activeScreenIdx, setActiveScreenIdx] = useState(0);
  const [sectionScroll, setSectionScroll] = useState(0); // 0 to 1
  const sectionRef = useRef<HTMLElement>(null);

  const setCursorVariant = useExperienceStore((s) => s.setCursorVariant);
  const setCursorText = useExperienceStore((s) => s.setCursorText);

  // Track scroll position within this specific section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
      setSectionScroll(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute cow position and state based on scroll
  // 5 Hex Stepping Stones: 0%, 25%, 50%, 75%, 100%
  const hexStones = [
    { id: 0, x: 10, y: 30, img: '/assets/battle-cows/Player 1 Claimed (Blue Rim).png' },
    { id: 1, x: 30, y: 65, img: '/assets/battle-cows/Golden Pasture.png' },
    { id: 2, x: 50, y: 25, img: '/assets/battle-cows/Neutral Pasture.png' },
    { id: 3, x: 70, y: 60, img: '/assets/battle-cows/Player 1 Claimed (Blue Rim).png' },
    { id: 4, x: 90, y: 30, img: '/assets/battle-cows/Golden Pasture.png' },
  ];

  // Derive hopping interpolation
  const getCowState = () => {
    const scaled = sectionScroll * 4; // 0 to 4
    const currentHex = Math.floor(scaled);
    const fraction = scaled - currentHex; // 0 to 1 between hexes

    const fromHex = hexStones[Math.min(currentHex, hexStones.length - 1)];
    const toHex = hexStones[Math.min(currentHex + 1, hexStones.length - 1)];

    const isLeaping = fraction > 0.25 && fraction < 0.75;
    const arcHeight = isLeaping ? Math.sin((fraction - 0.25) * 2 * Math.PI) * 70 : 0;

    const posX = fromHex.x + (toHex.x - fromHex.x) * fraction;
    const posY = fromHex.y + (toHex.y - fromHex.y) * fraction;

    return {
      x: posX,
      y: posY - arcHeight,
      isLeaping,
      currentHexIndex: currentHex,
    };
  };

  const cowState = getCowState();
  const activeScreen = product.screenshots[activeScreenIdx] || product.screenshots[0];

  return (
    <section
      id="battle-cows"
      ref={sectionRef}
      className="relative min-h-[150vh] flex flex-col justify-center px-6 sm:px-12 py-32 overflow-hidden transition-colors duration-1000"
      style={{
        background: 'radial-gradient(ellipse 95% 85% at 50% 50%, #083820 0%, #02170D 100%)',
      }}
    >
      {/* =========================================================================
          FIREWATCH-STYLE MULTI-LAYER PARALLAX EDGES (STACKED BEHIND & FOREGROUND)
          ========================================================================= */}

      {/* Layer 1: Left Background Hay Bales (Slow Parallax) */}
      <div
        className="absolute -left-12 top-1/4 w-44 sm:w-60 pointer-events-none opacity-40 blur-[1px] transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, ${(sectionScroll - 0.5) * 80}px, 0) rotate(-8deg)`,
        }}
      >
        <img src="/assets/battle-cows/Hay Bale.png" alt="" className="w-full h-auto drop-shadow-2xl" />
      </div>

      {/* Layer 2: Left Foreground Fence Gate (Fast Parallax) */}
      <div
        className="absolute -left-8 bottom-16 w-56 sm:w-80 pointer-events-none opacity-90 transition-transform duration-100 ease-out z-20"
        style={{
          transform: `translate3d(0, ${-(sectionScroll - 0.5) * 160}px, 0) rotate(6deg)`,
        }}
      >
        <img src="/assets/battle-cows/Fence Gate.png" alt="" className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Layer 3: Right Background Floating Pasture Hex (Slow Parallax) */}
      <div
        className="absolute -right-16 top-20 w-48 sm:w-64 pointer-events-none opacity-30 transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, ${(sectionScroll - 0.5) * 100}px, 0) rotate(18deg)`,
        }}
      >
        <img src="/assets/battle-cows/Golden Pasture.png" alt="" className="w-full h-auto drop-shadow-2xl" />
      </div>

      {/* Layer 4: Right Midground Hay Bale & Mud Prop */}
      <div
        className="absolute -right-8 bottom-28 w-48 sm:w-64 pointer-events-none opacity-80 transition-transform duration-100 ease-out z-20"
        style={{
          transform: `translate3d(0, ${-(sectionScroll - 0.5) * 140}px, 0) rotate(-12deg)`,
        }}
      >
        <img src="/assets/battle-cows/Hay Bale.png" alt="" className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" />
      </div>

      {/* =========================================================================
          THE BESPOKE CENTERPIECE: COW HOPPING FROM HEX TO HEX ON SCROLL
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-8 mb-16">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>THE BOVINE HOP // 60 FPS ARCADE PHYSICS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Battle Cows: Hex Board Game
          </h2>
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto font-light leading-relaxed">
            Scroll down to watch your Holstein hero leap across tactical pastures, conquering territory
            with bouncy indie game physics.
          </p>
        </div>

        {/* Tactical Hex Pasture Trail Stage */}
        <div
          onMouseEnter={() => {
            setCursorVariant('hover');
            setCursorText('LEAP');
          }}
          onMouseLeave={() => {
            setCursorVariant('default');
            setCursorText('');
          }}
          className="relative w-full max-w-4xl h-[300px] sm:h-[360px] mx-auto rounded-3xl p-6 bg-[#042013]/70 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.25)] overflow-hidden"
        >
          {/* Subtle Pasture Grid Overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* 5 Stepping Stone Hexes */}
          {hexStones.map((stone, idx) => {
            const isReached = cowState.currentHexIndex >= idx;
            return (
              <div
                key={stone.id}
                className={`absolute w-20 sm:w-28 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
                  isReached ? 'scale-105' : 'opacity-70 scale-95'
                }`}
                style={{
                  left: `${stone.x}%`,
                  top: `${stone.y}%`,
                }}
              >
                <img
                  src={stone.img}
                  alt={`Hex Pasture ${idx + 1}`}
                  className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
                />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/60 text-white/80 border border-white/20">
                  HEX 0{idx + 1}
                </span>
              </div>
            );
          })}

          {/* The Real Hopping Cow Sprite (Animates between leap and idle!) */}
          <div
            className="absolute w-20 sm:w-28 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-75"
            style={{
              left: `${cowState.x}%`,
              top: `${cowState.y}%`,
            }}
          >
            <img
              src={
                cowState.isLeaping
                  ? '/assets/battle-cows/p1_holstein_leap.png'
                  : '/assets/battle-cows/p1_holstein_idle.png'
              }
              alt="Battle Cow"
              className={`w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] transition-transform duration-150 ${
                cowState.isLeaping ? 'scale-125 -rotate-12' : 'scale-100'
              }`}
            />
            {/* Landing Dust Burst Effect when Idle */}
            {!cowState.isLeaping && (
              <img
                src="/assets/battle-cows/landing_dust_burst.png"
                alt=""
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 opacity-80 animate-ping"
                style={{ animationDuration: '2s' }}
              />
            )}
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-[#10B981]/40 text-[11px] font-mono text-[#10B981]">
            <Trophy className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>PROGRESS: {Math.round(sectionScroll * 100)}%</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ARCADE STRATEGY ARENA & PASTURE CONQUEST (NO GENERIC BOXED CARDS!)
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-12">
        {/* Arcade Headline & Live Territory Conquest Meter */}
        <div className="border-t border-white/10 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#10B981] uppercase font-bold flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#10B981]" />
              FLUTTER + FLAME 1.36 TURN-BASED ARENA
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight">
              Out-Hop. Out-Maneuver. Conquer the Pasture.
            </h3>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Live Pasture Conquest Split Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-[#38BDF8] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                  PLAYER 1 (HOLSTEIN): 64%
                </span>
                <span className="text-[#EF4444] flex items-center gap-1.5">
                  PLAYER 2 (AI BULL): 36%
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-blue-600 to-[#38BDF8] transition-all duration-500" style={{ width: '64%' }} />
                <div className="h-full bg-gradient-to-r from-[#DC2626] to-amber-500 transition-all duration-500" style={{ width: '36%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Arcade Game Mechanic Items (Borderless Floating Rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Zap className="w-4 h-4 text-[#10B981]" />
              <span>Parabolic Hex Leap</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Calculates parabolic hop physics across adjacent tiles. Trapped states trigger dizzy animations.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Trophy className="w-4 h-4 text-[#FBBF24]" />
              <span>Golden Pastures (2X)</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Capture high-value golden tiles to double your score multiplier and trigger milk shower VFX.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Target className="w-4 h-4 text-[#38BDF8]" />
              <span>Rocket Pad Catapult</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Launch across the board to flank opponent territory and escape tactical encirclement.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Flag className="w-4 h-4 text-[#A855F7]" />
              <span>Pass & Play / Solo AI</span>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Play offline pass-and-play with friends or challenge the tactical algorithmic AI.
            </p>
          </div>
        </div>

        {/* Store Actions & Screenshot Carousel */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <StoreBadge
              platform="google-play"
              url={product.storeUrl}
              variant="solid"
              label="Get on Google Play"
            />
            {product.itchUrl && (
              <StoreBadge platform="itch" url={product.itchUrl} variant="ghost" />
            )}
          </div>

          {/* Screenshot Switcher Thumbnails */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/50 hidden sm:inline max-w-[200px] truncate">
              {activeScreen.caption}
            </span>
            <button
              onClick={() =>
                setActiveScreenIdx((prev) => (prev === 0 ? product.screenshots.length - 1 : prev - 1))
              }
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous Battle Cows screenshot"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {product.screenshots.slice(0, 5).map((s, idx) => (
                <button
                  key={s.src}
                  onClick={() => setActiveScreenIdx(idx)}
                  className={`w-7 h-11 rounded overflow-hidden border transition-all ${
                    idx === activeScreenIdx
                      ? 'border-[#10B981] scale-110 shadow-[0_0_10px_#10B981]'
                      : 'border-white/20 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={s.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setActiveScreenIdx((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1))
              }
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next Battle Cows screenshot"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


