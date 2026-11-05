import { FC } from 'react';
import { Mail, Globe, Heart } from 'lucide-react';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const Footer: FC = () => {
  const setCursorVariant = useExperienceStore((s) => s.setCursorVariant);

  return (
    <footer className="relative z-20 w-full bg-[#07030F] border-t border-white/10 pt-16 pb-12 px-6 sm:px-12 text-white/70">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        {/* Col 1: Studio Identity */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#2C115F] border border-[#DCB0FF]/40 shadow-[0_0_12px_rgba(220,176,255,0.4)]">
              <img src="/assets/brand/logo-white.png" alt="The356Company" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">The356Company</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-md font-light">
            An independent software and game development studio. We engineer focused, high-performance
            applications and immersive indie games with meticulous craftsmanship.
          </p>
          <div className="text-xs font-mono text-white/40">
            Sfax, Tunisia // Global Distribution via Google Play & itch.io
          </div>
        </div>

        {/* Col 2: Published Flagships */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-[#DCB0FF] uppercase">
            Published Creations
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#pagelit"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-white transition-colors"
              >
                Pagelit: PDF Reader
              </a>
            </li>
            <li>
              <a
                href="#ar-explorer"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-white transition-colors"
              >
                AR Explorer: Spatial 3D
              </a>
            </li>
            <li>
              <a
                href="#the-system"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-white transition-colors"
              >
                The System: Party Card Game
              </a>
            </li>
            <li>
              <a
                href="#battle-cows"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-white transition-colors"
              >
                Battle Cows: Hex Board Game
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Direct Connect */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-[#DCB0FF] uppercase">
            Connect & Repositories
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://play.google.com/store/apps/developer?id=The356Company"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="inline-flex items-center gap-2 hover:text-[#00E5FF] transition-colors"
              >
                <Globe className="w-4 h-4" />
                Google Play Studio
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Youssef0356"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub (@Youssef0356)
              </a>
            </li>
            <li>
              <a
                href="mailto:nejiyoussef081@gmail.com"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="inline-flex items-center gap-2 hover:text-[#DCB0FF] transition-colors"
              >
                <Mail className="w-4 h-4" />
                nejiyoussef081@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Band */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 pt-8 gap-4 font-light">
        <div>
          © {new Date().getFullYear()} The356Company. All rights reserved. Built with pride & precision.
        </div>
        <div className="flex items-center gap-1">
          <span>Engineered with React 19, Three.js &</span>
          <Heart className="w-3.5 h-3.5 text-[#DCB0FF] inline" />
        </div>
      </div>
    </footer>
  );
};
