import { create } from 'zustand';

export type CursorVariant = 'default' | 'hover' | 'drag-3d' | 'reading-markup';

interface ExperienceState {
  activeSceneIndex: number;
  setActiveSceneIndex: (index: number) => void;

  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  cursorVariant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;

  cursorText: string;
  setCursorText: (text: string) => void;

  isAudioMuted: boolean;
  toggleAudio: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeSceneIndex: 0,
  setActiveSceneIndex: (index) => set({ activeSceneIndex: index }),

  scrollProgress: 0,
  setScrollProgress: (progress) => {
    let scene = 0;
    if (progress < 0.14) scene = 0;
    else if (progress < 0.52) scene = 1;
    else if (progress < 0.64) scene = 2;
    else if (progress < 0.88) scene = 3;
    else scene = 5;
    set({ scrollProgress: progress, activeSceneIndex: scene });
  },

  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  cursorText: '',
  setCursorText: (text) => set({ cursorText: text }),

  isAudioMuted: true,
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
}));
