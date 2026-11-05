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
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  cursorText: '',
  setCursorText: (text) => set({ cursorText: text }),

  isAudioMuted: true,
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
}));
