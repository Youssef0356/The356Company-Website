import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '@/stores/useExperienceStore';

gsap.registerPlugin(ScrollTrigger);

export const useLenisScroll = () => {
  const setScrollProgress = useExperienceStore((s) => s.setScrollProgress);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // 1. Hook Lenis directly into our global store on every single scroll frame
    lenis.on('scroll', (e: { progress: number }) => {
      ScrollTrigger.update();
      if (typeof e.progress === 'number' && !isNaN(e.progress)) {
        setScrollProgress(e.progress);
      }
    });

    // 2. Direct Window Scroll Fallback
    const onNativeScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Initial calculation
    onNativeScroll();

    return () => {
      window.removeEventListener('scroll', onNativeScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [setScrollProgress]);
};
