import { FC, useState, useEffect, useRef } from 'react';
import { ProductData } from '@/data/products';
import { StoreBadge } from '@/components/ui/StoreBadge';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { ARSpatialViewer, ARScanMode } from '@/components/canvas/ARSpatialViewer';
import {
  Compass,
  Box,
  ChevronLeft,
  ChevronRight,
  Activity,
  Eye,
  Radio,
  Scan,
} from 'lucide-react';

interface ARExplorerExperienceProps {
  product: ProductData;
}

export const ARExplorerExperience: FC<ARExplorerExperienceProps> = ({ product }) => {
  const [activeScreenIdx, setActiveScreenIdx] = useState(0);
  const [scanMode, setScanMode] = useState<ARScanMode>('pointcloud');
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

  const activeScreen = product.screenshots[activeScreenIdx] || product.screenshots[0];

  return (
    <section
      id="ar-explorer"
      ref={sectionRef}
      className="relative min-h-[150vh] flex flex-col justify-center px-6 sm:px-12 py-32 overflow-hidden transition-colors duration-1000"
      style={{
        background: 'radial-gradient(ellipse 95% 85% at 50% 50%, #081D42 0%, #030B1A 100%)',
      }}
    >
      {/* =========================================================================
          FIREWATCH-STYLE MULTI-LAYER PARALLAX EDGES (SPATIAL BLUEPRINT & AR MOTIFS)
          ========================================================================= */}

      {/* Layer 1: Left Background Spatial Hologram Mesh (Slow Parallax) */}
      <div
        className="absolute -left-12 top-1/4 w-52 sm:w-72 pointer-events-none opacity-30 blur-[0.5px] transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, ${(sectionScroll - 0.5) * 90}px, 0) rotate(-12deg)`,
        }}
      >
        <div className="w-full aspect-square rounded-full border-2 border-dashed border-[#00E5FF]/40 p-4 animate-spin" style={{ animationDuration: '30s' }}>
          <div className="w-full h-full rounded-full border border-[#38BDF8]/30 flex items-center justify-center">
            <Scan className="w-16 h-16 text-[#00E5FF]/40" />
          </div>
        </div>
      </div>

      {/* Layer 2: Left Foreground Real AR Screen Card (Fast Parallax) */}
      <div
        className="absolute -left-6 bottom-20 w-44 sm:w-64 pointer-events-none opacity-85 transition-transform duration-100 ease-out z-20 hidden md:block"
        style={{
          transform: `translate3d(0, ${-(sectionScroll - 0.5) * 150}px, 0) rotate(8deg) perspective(1000px) rotateY(15deg)`,
        }}
      >
        <div className="p-2 rounded-2xl bg-black/60 border border-[#00E5FF]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.2)] backdrop-blur-md">
          <img
            src="/screenshots/ar-explorer/play_01.png"
            alt="AR Interface"
            className="w-full h-auto rounded-xl object-cover"
          />
          <div className="mt-2 px-2 py-1 flex items-center justify-between text-[10px] font-mono text-[#00E5FF]">
            <span>ARCORE // 6-DOF</span>
            <span className="text-white/60">60 FPS</span>
          </div>
        </div>
      </div>

      {/* Layer 3: Right Background Coordinate Caliper Ticks (Medium Parallax) */}
      <div
        className="absolute -right-8 top-1/3 w-40 sm:w-56 pointer-events-none opacity-40 transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, ${(sectionScroll - 0.5) * 110}px, 0) rotate(20deg)`,
        }}
      >
        <div className="p-4 rounded-3xl bg-[#00E5FF]/5 border border-[#00E5FF]/30 font-mono text-[9px] text-[#38BDF8] space-y-1">
          <div>[GRID_CALIBRATION]</div>
          <div className="text-white/50">X: +02.4829m</div>
          <div className="text-white/50">Y: -00.1042m</div>
          <div className="text-white/50">Z: +01.9930m</div>
          <div className="text-[#00E5FF]">DEPTH: OCCLUDED</div>
        </div>
      </div>

      {/* Layer 4: Right Foreground Real AR Model Preview (Fast Counter-Parallax) */}
      <div
        className="absolute -right-6 bottom-28 w-44 sm:w-60 pointer-events-none opacity-80 transition-transform duration-100 ease-out z-20 hidden md:block"
        style={{
          transform: `translate3d(0, ${-(sectionScroll - 0.5) * 160}px, 0) rotate(-10deg) perspective(1000px) rotateY(-18deg)`,
        }}
      >
        <div className="p-2 rounded-2xl bg-black/60 border border-[#38BDF8]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.2)] backdrop-blur-md">
          <img
            src="/screenshots/ar-explorer/play_05.png"
            alt="AR Model Placement"
            className="w-full h-auto rounded-xl object-cover"
          />
          <div className="mt-2 px-2 py-1 flex items-center justify-between text-[10px] font-mono text-[#38BDF8]">
            <span>SPATIAL ANCHOR</span>
            <span className="text-emerald-400">LOCKED</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE BESPOKE CENTERPIECE: INTERACTIVE 3D WEBGL SPATIAL LABORATORY
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-8 mb-16">
        {/* Section Spatial Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#00E5FF]" />
            <span>INTERACTIVE WEBGL R3F SPATIAL LAB // 6-DOF DEPTH CORE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            AR Explorer: Spatial Computing
          </h2>
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto font-light leading-relaxed">
            Manipulate live WebGL 3D volumetric scans in real-time. Switch between LiDAR point-clouds,
            laser wireframe meshes, and chromatic depth heatmaps.
          </p>
        </div>

        {/* Scan Mode Control Matrix (No generic card! Clean floating spatial pills) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { id: 'pointcloud', label: '01 // LIDAR POINT CLOUD', icon: Activity },
            { id: 'wireframe', label: '02 // SPATIAL WIREFRAME', icon: Box },
            { id: 'heatmap', label: '03 // DEPTH OCCLUSION HEATMAP', icon: Eye },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = scanMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setScanMode(mode.id as ARScanMode)}
                onMouseEnter={() => {
                  setCursorVariant('hover');
                  setCursorText(mode.id.toUpperCase());
                }}
                onMouseLeave={() => {
                  setCursorVariant('default');
                  setCursorText('');
                }}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_25px_#00E5FF] scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/15 backdrop-blur-md'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#00E5FF]'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D WebGL Spatial Canvas Stage */}
        <div
          onMouseEnter={() => {
            setCursorVariant('hover');
            setCursorText('ROTATE 3D');
          }}
          onMouseLeave={() => {
            setCursorVariant('default');
            setCursorText('');
          }}
          className="relative w-full max-w-5xl mx-auto rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_60px_rgba(0,229,255,0.2)] overflow-hidden"
        >
          <ARSpatialViewer scanMode={scanMode} />
        </div>
      </div>

      {/* =========================================================================
          BORDERLESS SPATIAL TELEMETRY & CAPABILITIES (NO REPETITIVE BOXED CARDS!)
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-12">
        {/* 1. Expansive Horizontal Telemetry Strip (Open & Borderless) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-white/10">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase">Tracking Precision</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">0.012<span className="text-sm font-normal text-white/60 ml-1">mm</span></div>
            <p className="text-xs text-white/50 font-light">Sub-millimeter ARCore point convergence.</p>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase">Render Frame-Loop</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">60 <span className="text-sm font-normal text-white/60 ml-1">FPS</span></div>
            <p className="text-xs text-white/50 font-light">Ultra-smooth low-latency camera projection.</p>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-[#818CF8] uppercase">Spatial Degrees</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">6-DOF</div>
            <p className="text-xs text-white/50 font-light">Pitch, yaw, roll, surge, sway, and heave.</p>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase">Cloud Telemetry</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">0.00 <span className="text-sm font-normal text-white/60 ml-1">KB</span></div>
            <p className="text-xs text-white/50 font-light">100% on-device local camera privacy.</p>
          </div>
        </div>

        {/* 2. Fluid Asymmetrical Layout: Narrative & Spatial Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00E5FF]" />
                HARDWARE-ACCELERATED SPATIAL AUGMENTATION
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Transform Flat Glass Into an Infinite 3D Canvas.
              </h3>
            </div>

            <p className="text-base text-white/80 font-light leading-relaxed">
              {product.description}
            </p>

            {/* 4 Feature Items (Borderless floating rows, NOT cards with borders!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {product.highlights.map((h, idx) => (
                <div key={h.title} className="space-y-1.5 group">
                  <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:text-[#00E5FF] transition-colors">
                    <span className="text-xs font-mono text-[#00E5FF]">0{idx + 1}.</span>
                    <span>{h.title}</span>
                  </div>
                  <p className="text-xs text-white/60 font-light leading-relaxed pl-5">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Store Badges */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              <StoreBadge
                platform="google-play"
                url={product.storeUrl}
                variant="solid"
                label="Get on Google Play"
              />
              {product.githubUrl && (
                <StoreBadge platform="github" url={product.githubUrl} variant="ghost" />
              )}
              {product.webUrl && (
                <StoreBadge platform="web" url={product.webUrl} variant="ghost" />
              )}
            </div>
          </div>

          {/* Screenshot Showcase Preview (Borderless with subtle ambient glow) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[9/16] max-h-[460px] w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(0,229,255,0.25)] bg-black">
              <img
                src={activeScreen.src}
                alt={activeScreen.caption}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                <div className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider mb-1">
                  Verified ARCore Android Interface
                </div>
                <p className="text-xs font-semibold text-white truncate">{activeScreen.caption}</p>
              </div>
            </div>

            {/* Screenshot Thumbnail Switcher */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() =>
                  setActiveScreenIdx((prev) => (prev === 0 ? product.screenshots.length - 1 : prev - 1))
                }
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous AR screenshot"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {product.screenshots.slice(0, 5).map((s, idx) => (
                  <button
                    key={s.src}
                    onClick={() => setActiveScreenIdx(idx)}
                    className={`w-7 h-11 rounded-lg overflow-hidden border transition-all ${
                      idx === activeScreenIdx
                        ? 'border-[#00E5FF] scale-110 shadow-[0_0_12px_#00E5FF]'
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
                aria-label="Next AR screenshot"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


