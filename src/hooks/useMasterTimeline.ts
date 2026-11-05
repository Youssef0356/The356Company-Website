import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '@/stores/useExperienceStore';

gsap.registerPlugin(ScrollTrigger);

export const useMasterTimeline = () => {
  const setScrollProgress = useExperienceStore((s) => s.setScrollProgress);
  const setActiveSceneIndex = useExperienceStore((s) => s.setActiveSceneIndex);

  useEffect(() => {
    // Create master scroll trigger across the document body
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);

        // Determine active scene index for lighting and navigation
        if (progress < 0.15) {
          setActiveSceneIndex(0);
        } else if (progress < 0.35) {
          setActiveSceneIndex(1);
        } else if (progress < 0.55) {
          setActiveSceneIndex(2);
        } else if (progress < 0.75) {
          setActiveSceneIndex(3);
        } else if (progress < 0.90) {
          setActiveSceneIndex(4);
        } else {
          setActiveSceneIndex(5);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [setScrollProgress, setActiveSceneIndex]);
};


