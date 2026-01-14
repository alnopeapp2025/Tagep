import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSettingsStore = create&lt;SettingsState&gt;()(
  persist(
    (set) => ({
      soundEnabled: true, // مفعل افتراضياً
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'app-settings',
    }
  )
);
