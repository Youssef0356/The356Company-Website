import { FC, useState } from 'react';
import { Volume2, VolumeX, Menu, X, Sparkles } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSceneIndex = useExperienceStore((s) => s.activeSceneIndex);
  const isAudioMuted = useExperienceStore((s) => s.isAudioMuted);
  const toggleAudio = useExperienceStore((s) => s.toggleAudio);
  const setCursorVariant = useExperienceStore((s) => s.setCursorVariant);

  const navItems = [
    { label: 'Overview', href: '#hero', index: 0 },
    { label: 'AR Explorer', href: '#ar-explorer', index: 1 },
    { label: 'Pagelit', href: '#pagelit', index: 2 },
    { label: 'The System', href: '#the-system', index: 3 },
    { label: 'Battle Cows', href: '#battle-cows', index: 4 },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-300">
        <div className="flex items-center justify-between px-5 py-3 rounded-full bg-[#0E071F]/70 backdrop-blur-2xl border border-[#DCB0FF]/20 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          {/* Studio Brand Anchor */}
          <a
            href="#hero"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#2C115F] border border-[#DCB0FF]/40 shadow-[0_0_12px_rgba(220,176,255,0.4)] group-hover:scale-105 transition-transform duration-300">
              <img src="/assets/brand/logo-white.png" alt="The356Company Logo" className="w-5 h-5 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-[#DCB0FF] transition-colors">
                The356Company
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 -mt-0.5">
                Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-white/70">
            {navItems.map((item) => {
              const isActive = activeSceneIndex === item.index;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold shadow-[0_0_12px_rgba(220,176,255,0.3)] border border-white/20'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
              title={isAudioMuted ? 'Unmute Ambient Soundscape' : 'Mute Soundscape'}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#DCB0FF]" />}
            </button>

            {/* Ecosystem CTA Pill */}
            <a
              href="#ecosystem"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#DCB0FF] to-white text-[#2C115F] hover:shadow-[0_0_20px_rgba(220,176,255,0.6)] hover:scale-102 transition-all duration-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2C115F]" />
              Ecosystem
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#07030F]/95 backdrop-blur-3xl flex flex-col justify-center px-8 space-y-6 md:hidden animate-in fade-in duration-300">
          <div className="text-xs font-mono tracking-widest text-[#DCB0FF] uppercase">
            Navigation Index
          </div>
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className="text-2xl font-bold text-white hover:text-[#DCB0FF] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#ecosystem"
              onClick={handleLinkClick}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#DCB0FF] to-white pt-2"
            >
              The Connected Ecosystem →
            </a>
          </div>
        </div>
      )}
    </>
  );
};


