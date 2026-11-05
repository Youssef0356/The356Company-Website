import { FC, useState } from 'react';
import { ProductData } from '@/data/products';
import { GlassCard } from '@/components/ui/GlassCard';
import { StoreBadge } from '@/components/ui/StoreBadge';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ProductShowcaseProps {
  product: ProductData;
  reversed?: boolean;
}

export const ProductShowcase: FC<ProductShowcaseProps> = ({ product, reversed = false }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const setCursorVariant = useExperienceStore((s) => s.setCursorVariant);
  const setCursorText = useExperienceStore((s) => s.setCursorText);

  const activeScreen = product.screenshots[activeIdx] || product.screenshots[0];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? product.screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id={product.id} className="min-h-screen flex items-center px-6 sm:px-12 py-24 max-w-7xl mx-auto">
      <div
        className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
          reversed ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Left Column: Product Information & Specifications */}
        <div className={`lg:col-span-7 space-y-6 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <GlassCard glowColor={product.accentColor}>
            <div className="space-y-6">
              {/* Header Badge & Version */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold"
                  style={{
                    backgroundColor: `${product.accentColor}18`,
                    color: product.accentColor,
                    borderColor: `${product.accentColor}40`,
                    borderWidth: 1,
                  }}
                >
                  {product.badge}
                </span>
                <span className="text-xs font-mono text-white/50">{product.version}</span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {product.title}
                </h2>
                <p className="text-sm sm:text-base font-medium" style={{ color: product.accentColor }}>
                  {product.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-base text-white/80 font-light leading-relaxed">
                {product.description}
              </p>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {product.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1 hover:border-white/20 transition-colors"
                  >
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.accentColor }} />
                      {h.title}
                    </div>
                    <div className="text-xs text-white/60 font-light leading-relaxed">{h.desc}</div>
                  </div>
                ))}
              </div>

              {/* Verified Product Stats Band */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
                {product.stats.map((s) => (
                  <div key={s.label} className="p-2.5 rounded-xl bg-black/20">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">{s.label}</div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <StoreBadge
                  platform="google-play"
                  url={product.storeUrl}
                  variant="solid"
                  label="Get on Google Play"
                />
                {product.itchUrl && (
                  <StoreBadge platform="itch" url={product.itchUrl} variant="ghost" />
                )}
                {product.githubUrl && (
                  <StoreBadge platform="github" url={product.githubUrl} variant="ghost" />
                )}
                {product.webUrl && (
                  <StoreBadge platform="web" url={product.webUrl} variant="ghost" />
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Interactive Phone Mockup Reel */}
        <div className={`lg:col-span-5 flex flex-col items-center justify-center ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] group">
            {/* Ambient Background Glow behind device */}
            <div
              className="absolute inset-0 rounded-[44px] blur-3xl opacity-25 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
              style={{ backgroundColor: product.accentColor }}
            />

            {/* Smartphone Bezel Chassis */}
            <div className="relative rounded-[40px] p-3 bg-gradient-to-b from-[#1C1236] to-[#0A0515] border-2 border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {/* Camera Dynamic Island Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/80 rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20" />
              </div>

              {/* Active Screen View */}
              <div
                onClick={() => setModalOpen(true)}
                onMouseEnter={() => {
                  setCursorVariant('hover');
                  setCursorText('ZOOM');
                }}
                onMouseLeave={() => {
                  setCursorVariant('default');
                  setCursorText('');
                }}
                className="relative aspect-[9/19.5] w-full rounded-[30px] overflow-hidden bg-black cursor-zoom-in group/screen"
              >
                <img
                  src={activeScreen.src}
                  alt={activeScreen.caption}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/screen:scale-105"
                />

                {/* Glass Glare Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />

                {/* Zoom Pill Overlay */}
                <div className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 opacity-0 group-hover/screen:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Nav Arrows Floating on Frame */}
              <button
                onClick={handlePrev}
                aria-label="Previous screenshot"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="absolute left-[-16px] top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0E071F]/90 border border-white/20 text-white shadow-lg hover:scale-110 hover:border-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next screenshot"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="absolute right-[-16px] top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0E071F]/90 border border-white/20 text-white shadow-lg hover:scale-110 hover:border-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Active Screen Caption */}
            <div className="text-center mt-4 space-y-1">
              <div className="text-xs font-mono text-white/50">
                SCREEN {activeIdx + 1} OF {product.screenshots.length}
              </div>
              <p className="text-xs font-medium text-white/80 truncate max-w-xs mx-auto">
                {activeScreen.caption}
              </p>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto py-1">
              {product.screenshots.map((s, idx) => (
                <button
                  key={s.src}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-9 h-14 rounded-md overflow-hidden border transition-all duration-300 ${
                    idx === activeIdx
                      ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={s.src} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setModalOpen(false)}
            aria-label="Close image modal"
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-4xl flex flex-col items-center"
          >
            <img
              src={activeScreen.src}
              alt={activeScreen.caption}
              className="max-h-[75vh] w-auto rounded-2xl shadow-2xl border border-white/20 object-contain"
            />
            <div className="mt-4 text-center max-w-md">
              <span className="text-xs font-mono text-[#DCB0FF] uppercase tracking-wider block mb-1">
                {product.title} // Screen {activeIdx + 1}
              </span>
              <p className="text-sm text-white/90 font-medium">{activeScreen.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
