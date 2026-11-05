import { FC, useEffect, useRef, useState } from 'react';
import { ProductData } from '@/data/products';
import { StoreBadge } from '@/components/ui/StoreBadge';
import { useExperienceStore } from '@/stores/useExperienceStore';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSearch,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface TheSystemExperienceProps {
  product: ProductData;
}

type RedactionKey = 'assassin' | 'challenge';

const secretCards = [
  { name: 'Businessman', img: '/assets/the-system/Businessman.png' },
  { name: 'Taxman', img: '/assets/the-system/taxman.png' },
  { name: 'Assassin', img: '/assets/the-system/Assassin.png' },
  { name: 'Marshal', img: '/assets/the-system/marshal.png' },
  { name: 'Detective', img: '/assets/the-system/Detective.png' },
  { name: 'Politician', img: '/assets/the-system/politician.jpg' },
  { name: 'Thief', img: '/assets/the-system/Thief.png' },
];

export const TheSystemExperience: FC<TheSystemExperienceProps> = ({ product }) => {
  const [activeScreenIdx, setActiveScreenIdx] = useState(0);
  const [sectionScroll, setSectionScroll] = useState(0);
  const [revealedRedactions, setRevealedRedactions] = useState<Record<RedactionKey, boolean>>({
    assassin: false,
    challenge: false,
  });
  const sectionRef = useRef<HTMLElement>(null);
  const setCursorVariant = useExperienceStore((s) => s.setCursorVariant);
  const setCursorText = useExperienceStore((s) => s.setCursorText);
  const activeScreen = product.screenshots[activeScreenIdx] || product.screenshots[0];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const height = window.innerHeight;
      setSectionScroll(Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height))));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleRedaction = (key: RedactionKey) => {
    setRevealedRedactions((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  return (
    <section
      id="the-system"
      ref={sectionRef}
      className="relative flex min-h-[150vh] flex-col justify-center overflow-hidden px-6 py-32 sm:px-12"
      style={{
        background: 'radial-gradient(ellipse 85% 75% at 50% 42%, #342019 0%, #180F0D 45%, #100B0B 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,222,174,.7) .55px, transparent .65px)',
          backgroundSize: '5px 5px',
          maskImage: 'linear-gradient(90deg, transparent, #000 50%, transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-12 top-1/4 hidden w-64 opacity-25 transition-transform duration-100 md:block"
        style={{
          transform: 'translate3d(0,' + ((sectionScroll - 0.5) * 100) + 'px,0) rotate(12deg)',
        }}
      >
        <img src="/assets/the-system/Back of the cards.png" alt="" className="w-full drop-shadow-2xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-12">
        <header className="mx-auto max-w-4xl space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-black/30 px-4 py-1.5 text-xs font-mono tracking-widest text-[#F59E0B] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            SOCIAL DEDUCTION / SECRET IDENTITIES
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {product.title}
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/65 sm:text-lg">
            {product.description}
          </p>
        </header>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <article
            className="glass-panel-amber rounded-3xl p-6 sm:p-8"
            onMouseEnter={() => {
              setCursorVariant('hover');
              setCursorText('CHALLENGE');
            }}
            onMouseLeave={() => {
              setCursorVariant('default');
              setCursorText('');
            }}
          >
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#F59E0B]">
              <FileSearch className="h-4 w-4" />
              THE TABLE / PRIVATE INFORMATION
            </div>
            <h3 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
              Make your claim. Read the room.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Players speak from hidden identities. A claim can be true, a bluff, or an invitation
              for someone else to challenge it.
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono tracking-widest text-white/40">
                <span>TABLE EXCHANGE / 01</span>
                <span className="text-[#F59E0B]">PASS &amp; PLAY</span>
              </div>
              <p className="mt-5 text-sm leading-loose text-white/75">
                ?I am the{' '}
                <button
                  type="button"
                  onClick={() => toggleRedaction('assassin')}
                  aria-pressed={revealedRedactions.assassin}
                  className={'rounded px-1.5 py-0.5 font-bold transition-colors ' + (
                    revealedRedactions.assassin
                      ? 'bg-[#EF4444]/30 text-white'
                      : 'bg-white/80 text-transparent'
                  )}
                  title="Reveal the hidden role"
                >
                  Assassin
                </button>
                .?
              </p>
              <p className="mt-2 text-sm leading-loose text-white/65">
                The turn becomes a test of trust.{' '}
                <button
                  type="button"
                  onClick={() => toggleRedaction('challenge')}
                  aria-pressed={revealedRedactions.challenge}
                  className={'rounded px-1.5 py-0.5 font-bold transition-colors ' + (
                    revealedRedactions.challenge
                      ? 'bg-[#F59E0B]/30 text-white'
                      : 'bg-white/80 text-transparent'
                  )}
                  title="Reveal the challenge"
                >
                  An opponent may call the bluff.
                </button>
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] text-white/45">
                <Eye className="h-3.5 w-3.5 text-[#F59E0B]" />
                Click the redactions to reveal the exchange.
              </div>
            </div>
          </article>

          <div className="glass-panel-amber flex flex-col rounded-3xl p-5 sm:p-6">
            {activeScreen && (
              <figure className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#F59E0B]/25 bg-black/40">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[10px] font-mono tracking-widest text-white/45">
                  <span>THE SYSTEM / GAME VIEW</span>
                  <span>{String(activeScreenIdx + 1).padStart(2, '0')} / {product.screenshots.length}</span>
                </div>
                <img
                  src={activeScreen.src}
                  alt={activeScreen.caption}
                  className="mx-auto max-h-[560px] w-full flex-1 object-contain"
                  loading="lazy"
                />
                <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-white/60">
                  {activeScreen.caption}
                </figcaption>
              </figure>
            )}
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="truncate text-[10px] font-mono text-white/45">SCREENSHOT INDEX</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveScreenIdx((previous) => (
                    previous === 0 ? product.screenshots.length - 1 : previous - 1
                  ))}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/20 text-white hover:border-[#F59E0B]"
                  aria-label="Previous The System screenshot"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScreenIdx((previous) => (
                    previous === product.screenshots.length - 1 ? 0 : previous + 1
                  ))}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/20 text-white hover:border-[#F59E0B]"
                  aria-label="Next The System screenshot"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#F59E0B]">
            <ShieldCheck className="h-4 w-4" />
            SEVEN HIDDEN IDENTITIES
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {secretCards.map((card) => (
              <div key={card.name} className="group space-y-2">
                <div className="aspect-[2.5/3.5] overflow-hidden rounded-xl border border-[#F59E0B]/30 bg-black shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-[#EF4444]">
                  <img
                    src={card.img}
                    alt={card.name + ' role card'}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="text-center text-[10px] font-mono font-bold tracking-wide text-white/70 group-hover:text-[#F59E0B]">
                  {card.name.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <StoreBadge
              platform="google-play"
              url={product.storeUrl}
              variant="solid"
              label="Get The System on Google Play"
            />
            {product.itchUrl && (
              <StoreBadge platform="itch" url={product.itchUrl} variant="ghost" />
            )}
          </div>
          <div className="flex items-center gap-2" aria-label="Choose a screenshot">
            {product.screenshots.slice(0, 5).map((screen, index) => (
              <button
                key={screen.src}
                type="button"
                onClick={() => setActiveScreenIdx(index)}
                aria-label={'Show screenshot ' + (index + 1) + ': ' + screen.caption}
                aria-pressed={activeScreenIdx === index}
                className={'h-11 w-7 overflow-hidden rounded border transition-all ' + (
                  activeScreenIdx === index
                    ? 'border-[#EF4444] opacity-100 shadow-[0_0_10px_#EF4444]'
                    : 'border-white/20 opacity-50 hover:opacity-80'
                )}
              >
                <img src={screen.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <a href="#battle-cows" className="system-next" aria-label="Continue to Battle Cows">
        <span>Continue to Battle Cows</span>
        <ChevronRight className="h-4 w-4" />
      </a>
    </section>
  );
};
