import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useMasterTimeline initializes GSAP ScrollTrigger global refresh/sync.
 * Scroll progress is managed smoothly by useLenisScroll.
 */
export const useMasterTimeline = () => {
  useEffect(() => {
    ScrollTrigger.refresh();

    return () => {
      // Clean up any remaining triggers
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};
