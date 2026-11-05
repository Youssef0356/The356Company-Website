import { FC, useState, useEffect, useRef } from 'react';
import { ProductData } from '@/data/products';
import { StoreBadge } from '@/components/ui/StoreBadge';
import { useExperienceStore } from '@/stores/useExperienceStore';
import {
  FileText,
  ShieldCheck,
  Sun,
  Moon,
  Eye,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Highlighter,
  Bookmark,
  Check,
} from 'lucide-react';

interface PagelitExperienceProps {
  product: ProductData;
}

type ReadingTheme = 'dark' | 'light' | 'sepia' | 'night';

export const PagelitExperience: FC<PagelitExperienceProps> = ({ product }) => {
  const [activeScreenIdx, setActiveScreenIdx] = useState(0);
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('dark');
  const [activePageIdx, setActivePageIdx] = useState(0); // 0, 1, 2
  const [activeHighlightColor, setActiveHighlightColor] = useState('#FACC15');
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

      // Auto flip page based on scroll scrub
      if (progress < 0.35) {
        setActivePageIdx(0);
      } else if (progress < 0.7) {
        setActivePageIdx(1);
      } else {
        setActivePageIdx(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeStyles = {
    dark: {
      bg: 'bg-[#0E0F12]',
      text: 'text-white/90',
      subtext: 'text-white/60',
      border: 'border-white/10',
      pageBg: 'bg-[#15171E]',
    },
    light: {
      bg: 'bg-[#F8FAFC]',
      text: 'text-[#0F172A]',
      subtext: 'text-[#475569]',
      border: 'border-black/10',
      pageBg: 'bg-[#FFFFFF]',
    },
    sepia: {
      bg: 'bg-[#FBF0D9]',
      text: 'text-[#433422]',
      subtext: 'text-[#6B563D]',
      border: 'border-[#433422]/20',
      pageBg: 'bg-[#F6E8CE]',
    },
    night: {
      bg: 'bg-[#05070A]',
      text: 'text-amber-100/70',
      subtext: 'text-amber-200/50',
      border: 'border-amber-500/10',
      pageBg: 'bg-[#0A0D14]',
    },
  };

  const highlightOptions = [
    { name: 'Neon Yellow', color: '#FACC15' },
    { name: 'Electric Cyan', color: '#00E5FF' },
    { name: 'Pastel Mint', color: '#10B981' },
    { name: 'Sunset Rose', color: '#F43F5E' },
  ];

  const activeScreen = product.screenshots[activeScreenIdx] || product.screenshots[0];

  return (
    <section
      id="pagelit"
      ref={sectionRef}
      className="relative min-h-[150vh] flex flex-col justify-center px-6 sm:px-12 py-32 overflow-hidden transition-colors duration-1000"
      style={{
        background: 'radial-gradient(ellipse 95% 85% at 50% 50%, #08333D 0%, #021317 100%)',
      }}
    >
      {/* =========================================================================
          FIREWATCH-STYLE MULTI-LAYER PARALLAX EDGES (FLOATING PAGES & BRAND ASSETS)
          ========================================================================= */}

      {/* Layer 1: Left Background Floating Document Leaf (Slow Parallax) */}
      <div
        className="absolute -left-12 top-1/4 w-48 sm:w-64 pointer-events-none opacity-30 blur-[0.5px] transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, ${(sectionScroll - 0.5) * 80}px, 0) rotate(-14deg)`,
        }}
      >
        <div className="w-full aspect-[3/4] rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 p-5 shadow-2xl backdrop-blur-sm space-y-3">
          <div className="w-12 h-2 rounded bg-[#00E5FF]/40" />
          <div className="w-full h-1.5 rounded bg-white/20" />
          <div className="w-4/5 h-1.5 rounded bg-white/20" />
          <div className="w-2/3 h-1.5 rounded bg-[#00E5FF]/30" />
        </div>
      </div>

      {/* Layer 2: Left Foreground Pagelit Splash Logo Badge (Fast Counter-Parallax) */}
      <div
        className="absolute -left-6 bottom-24 w-36 sm:w-52 pointer-events-none opacity-85 transition-transform duration-100 ease-out z-20 hidden md:block"
        style={{
          transform: `translate3d(0, ${-(sectionScroll - 0.5) * 140}px, 0) rotate(10deg)`,
        }}
      >
        <div className="p-3.5 rounded-3xl bg-black/60 border border-[#00E5FF]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.2)] backdrop-blur-md flex flex-col items-center text-center space-y-2">
          <img
            src="/assets/pagelit/pagelit_splash_logo.png"
            alt="Pagelit Icon"
            className="w-16 h-16 drop-shadow-lg"
          />
          <div className="text-[10px] font-mono text-[#00E5FF] font-bold">100% ON-DEVICE</div>
          <div className="text-[9px] text-white/60">Zero Cloud Data</div>
        </div>
      </div>

      {/* Layer 3: Right Background Floating Highlighter Strips (Medium Parallax) */}
      <div
        className="absolute -right-8 top-1/3 w-40 sm:w-56 pointer-events-none opacity-40 transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, ${(sectionScroll - 0.5) * 110}px, 0) rotate(18deg)`,
        }}
      >
        <div className="p-4 rounded-3xl bg-[#00E5FF]/5 border border-[#00E5FF]/30 font-mono text-[9px] text-[#00E5FF] space-y-2">
          <div className="px-2 py-0.5 rounded bg-[#FACC15]/30 text-white font-bold w-fit">PDF SPEC 2.0</div>
          <div className="px-2 py-0.5 rounded bg-[#00E5FF]/30 text-white font-bold w-fit">DOCX COMPLIANT</div>
          <div className="text-white/50">PARSING ENGINE // LOCAL</div>
        </div>
      </div>

      {/* Layer 4: Right Foreground Real Document Preview (Fast Parallax) */}
      <div
        className="absolute -right-6 bottom-24 w-44 sm:w-60 pointer-events-none opacity-85 transition-transform duration-100 ease-out z-20 hidden md:block"
        style={{
          transform: `translate3d(0, ${-(sectionScroll - 0.5) * 160}px, 0) rotate(-12deg) perspective(1000px) rotateY(-16deg)`,
        }}
      >
        <div className="p-2.5 rounded-2xl bg-black/60 border border-[#00E5FF]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.2)] backdrop-blur-md">
          <img
            src="/screenshots/pagelit/play_01.png"
            alt="Pagelit Reading Interface"
            className="w-full h-auto rounded-xl object-cover"
          />
          <div className="mt-2 px-2 py-1 flex items-center justify-between text-[10px] font-mono text-[#00E5FF]">
            <span>OFFLINE VIEWER</span>
            <span className="text-white/60">PAGE 1/42</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE BESPOKE CENTERPIECE: 3D DUAL-PAGE SCROLL PAGEFLIP BINDER
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-8 mb-16">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D PAGE-FLIP & LIVE HIGHLIGHTER ENGINE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Pagelit: High-Density Reader
          </h2>
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto font-light leading-relaxed">
            Flip through real 3D perspectives on scroll or with interactive chapter tabs.
            Experience instant pan, pinch zoom, and fluid multi-color fluorescent markup.
          </p>
        </div>

        {/* 3D Binder Showcase Stage (Pure interactive hero) */}
        <div
          onMouseEnter={() => {
            setCursorVariant('hover');
            setCursorText('PAGEFLIP');
          }}
          onMouseLeave={() => {
            setCursorVariant('default');
            setCursorText('');
          }}
          className="relative w-full max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 bg-[#03181C]/70 shadow-[0_30px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(0,229,255,0.2)] overflow-hidden"
        >
          {/* Header Controls: Chapter Navigation & Theme Pickers */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 z-20">
            {/* 3 Interactive Chapter Tabs */}
            <div className="flex items-center gap-2">
              {[
                { idx: 0, label: 'CH. 1 // ZERO-CLOUD' },
                { idx: 1, label: 'CH. 2 // 7-COLOR HIGHLIGHT' },
                { idx: 2, label: 'CH. 3 // PERFORMANCE' },
              ].map((tab) => (
                <button
                  key={tab.idx}
                  onClick={() => setActivePageIdx(tab.idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                    activePageIdx === tab.idx
                      ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_#00E5FF]'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Reading Theme Selectors */}
            <div className="flex items-center gap-2 p-1 rounded-full bg-black/50 border border-white/10">
              <span className="text-[11px] font-mono text-white/50 px-2">THEME:</span>
              <button
                onClick={() => setReadingTheme('dark')}
                title="AMOLED Dark"
                className={`p-1.5 rounded-full transition-colors ${
                  readingTheme === 'dark' ? 'bg-[#00E5FF] text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('light')}
                title="Clean Light"
                className={`p-1.5 rounded-full transition-colors ${
                  readingTheme === 'light' ? 'bg-[#00E5FF] text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('sepia')}
                title="Warm Sepia"
                className={`p-1.5 rounded-full transition-colors ${
                  readingTheme === 'sepia' ? 'bg-[#00E5FF] text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* THE 3D OPEN BOOK / DUAL-PAGE BINDER */}
          <div className="my-8 perspective-1500 flex justify-center">
            <div
              className={`relative w-full max-w-3xl min-h-[440px] sm:min-h-[460px] rounded-2xl border shadow-2xl preserve-3d transition-all duration-500 grid grid-cols-1 md:grid-cols-2 ${themeStyles[readingTheme].bg} ${themeStyles[readingTheme].border}`}
            >
              {/* Binder Center Spine Hinge with Metallic Ring Clips */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-black/40 z-30 hidden md:flex flex-col justify-around items-center pointer-events-none">
                <div className="w-2 h-4 rounded-full bg-neutral-600 border border-neutral-400" />
                <div className="w-2 h-4 rounded-full bg-neutral-600 border border-neutral-400" />
                <div className="w-2 h-4 rounded-full bg-neutral-600 border border-neutral-400" />
                <div className="w-2 h-4 rounded-full bg-neutral-600 border border-neutral-400" />
              </div>

              {/* LEFT PAGE: FIXED MANIFEST */}
              <div
                className={`p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r ${themeStyles[readingTheme].border} ${themeStyles[readingTheme].pageBg} rounded-l-2xl`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#00E5FF] font-bold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      PAGELIT ENGINE v{product.version}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">OFFLINE SANDBOX</span>
                  </div>

                  <h4 className={`text-xl font-serif font-bold ${themeStyles[readingTheme].text}`}>
                    Privacy-First Document Architecture
                  </h4>

                  <p className={`text-xs leading-relaxed font-serif ${themeStyles[readingTheme].subtext}`}>
                    Pagelit was engineered to solve a critical compromise in modern mobile software:
                    third-party document readers that silently upload contracts, tax forms, and medical records
                    to cloud servers for telemetry and ads.
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#00E5FF]/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF]">
                      <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                      Zero Telemetry Protocol
                    </div>
                    <ul className="text-[11px] space-y-1 text-white/80 font-sans">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#10B981]" /> Zero user accounts or registrations
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#10B981]" /> Zero cloud synchronization background daemons
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#10B981]" /> 100% On-Device native C++ vector parser
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10 text-[10px] font-mono text-white/40">
                  <span>DOCUMENT ID: 356-PL-2026</span>
                  <span>PAGE 01</span>
                </div>
              </div>

              {/* RIGHT PAGE: DYNAMIC FLIPPING PAGE */}
              <div className="relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden preserve-3d rounded-r-2xl">
                {/* PAGE 1 CONTENT */}
                <div
                  className={`space-y-4 transition-opacity duration-300 ${
                    activePageIdx === 0 ? 'opacity-100' : 'opacity-0 absolute inset-6 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                      CHAPTER 01 // LOCAL PARSER
                    </span>
                    <span className="text-[10px] font-mono text-white/40">PAGE 02</span>
                  </div>

                  <h4 className={`text-xl font-serif font-bold ${themeStyles[readingTheme].text}`}>
                    Instant Pan & High-DPI Vector Rendering
                  </h4>

                  <p className={`text-xs leading-relaxed font-serif ${themeStyles[readingTheme].subtext}`}>
Pagelit keeps the reading surface clear and gives you a quick way to mark important passages.
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF]">
                      <Highlighter className="h-4 w-4" />
                      Pick a markup color
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {highlightOptions.map((option) => (
                        <button
                          key={option.color}
                          type="button"
                          onClick={() => setActiveHighlightColor(option.color)}
                          aria-label={'Choose ' + option.name + ' highlight color'}
                          aria-pressed={activeHighlightColor === option.color}
                          className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                          style={{
                            backgroundColor: option.color,
                            borderColor: activeHighlightColor === option.color ? '#FFFFFF' : 'transparent',
                            boxShadow: activeHighlightColor === option.color ? '0 0 15px ' + option.color : 'none',
                          }}
                        />
                      ))}
                    </div>
                    <p className={'text-xs leading-relaxed font-serif ' + themeStyles[readingTheme].subtext}>
                      A short mark can make the next reading session easier to resume:
                      <span className="ml-2 inline-block rounded px-1 text-black" style={{ backgroundColor: activeHighlightColor }}>
                        key passage
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  className={'space-y-4 transition-opacity duration-300 ' + (
                    activePageIdx === 1 ? 'opacity-100' : 'opacity-0 absolute inset-6 pointer-events-none'
                  )}
                  aria-hidden={activePageIdx !== 1}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                      CHAPTER 02 // MARKUP
                    </span>
                    <span className="text-[10px] font-mono text-white/40">PAGE 03</span>
                  </div>
                  <h4 className={'text-xl font-serif font-bold ' + themeStyles[readingTheme].text}>
                    Mark the passages that matter
                  </h4>
                  <p className={'text-xs leading-relaxed font-serif ' + themeStyles[readingTheme].subtext}>
                    Highlights, notes, and reading tools are part of the document experience. Choose a color,
                    then carry that visual cue through the page.
                  </p>
                  <div className="rounded-xl border border-white/10 bg-black/10 p-5">
                    <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                      <Bookmark className="h-4 w-4 text-[#00E5FF]" />
                      READING NOTE
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">
                      ?The clearest idea is often the one worth returning to.?
                    </p>
                    <div className="mt-4 h-1 w-1/2 rounded" style={{ backgroundColor: activeHighlightColor }} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-white/55">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Select a chapter above or scroll through the section.
                  </div>
                </div>

                <div
                  className={'space-y-4 transition-opacity duration-300 ' + (
                    activePageIdx === 2 ? 'opacity-100' : 'opacity-0 absolute inset-6 pointer-events-none'
                  )}
                  aria-hidden={activePageIdx !== 2}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                      CHAPTER 03 // READING COMFORT
                    </span>
                    <span className="text-[10px] font-mono text-white/40">PAGE 04</span>
                  </div>
                  <h4 className={'text-xl font-serif font-bold ' + themeStyles[readingTheme].text}>
                    Let the page fit the moment
                  </h4>
                  <p className={'text-xs leading-relaxed font-serif ' + themeStyles[readingTheme].subtext}>
                    Move between light, dark, and sepia tones to find a comfortable reading surface.
                  </p>
                  {activeScreen && (
                    <figure className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <img
                        src={activeScreen.src}
                        alt={activeScreen.caption}
                        className="mx-auto max-h-60 w-auto object-contain"
                        loading="lazy"
                      />
                      <figcaption className="border-t border-white/10 px-3 py-2 text-[10px] font-mono text-white/55">
                        {activeScreen.caption}
                      </figcaption>
                    </figure>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono text-white/40">
                  <span>PAGE {String(activePageIdx + 2).padStart(2, '0')}</span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-[#00E5FF]" />
                    PAGELIT / READING SURFACE
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-5">
            <StoreBadge
              platform="google-play"
              url={product.storeUrl}
              variant="solid"
              label="Get Pagelit on Google Play"
            />
            <div className="flex items-center gap-2">
              <span className="mr-1 hidden max-w-48 truncate text-[10px] font-mono text-white/50 sm:inline">
                {activeScreen?.caption || 'Pagelit screenshots'}
              </span>
              <button
                type="button"
                onClick={() => setActiveScreenIdx((prev) => (
                  prev === 0 ? product.screenshots.length - 1 : prev - 1
                ))}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15"
                aria-label="Previous Pagelit screenshot"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {product.screenshots.slice(0, 5).map((screen, idx) => (
                  <button
                    key={screen.src}
                    type="button"
                    onClick={() => setActiveScreenIdx(idx)}
                    aria-label={'Show screenshot ' + (idx + 1) + ': ' + screen.caption}
                    aria-pressed={idx === activeScreenIdx}
                    className={'h-11 w-7 overflow-hidden rounded border transition-all ' + (
                      idx === activeScreenIdx
                        ? 'border-[#00E5FF] opacity-100 shadow-[0_0_12px_rgba(0,229,255,0.45)]'
                        : 'border-white/20 opacity-50 hover:opacity-80'
                    )}
                  >
                    <img src={screen.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveScreenIdx((prev) => (
                  prev === product.screenshots.length - 1 ? 0 : prev + 1
                ))}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15"
                aria-label="Next Pagelit screenshot"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <a href="#the-system" className="pagelit-next" aria-label="Continue to The System">
        <span>Continue to The System</span>
        <ChevronRight className="h-4 w-4" />
      </a>
    </section>
  );
};
