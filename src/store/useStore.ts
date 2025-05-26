import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FileData {
  name: string;
  data: any[];
  columns: string[];
  timestamp: number;
}

interface Store {
  currentFile: FileData | null;
  fileHistory: FileData[];
  setCurrentFile: (file: FileData) => void;
  addToHistory: (file: FileData) => void;
  clearCurrentFile: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      currentFile: null,
      fileHistory: [],
      setCurrentFile: (file) => set({ currentFile: file }),
      addToHistory: (file) =>
        set((state) => ({
          fileHistory: [file, ...state.fileHistory].slice(0, 10),
        })),
      clearCurrentFile: () => set({ currentFile: null }),
    }),
    {
      name: 'visualize-ai-storage',
    }
  )
); 