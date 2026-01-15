import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSettingsStore = create&lt;SettingsState&gt;()(
  persist(
    (set) =&gt; ({
      soundEnabled: true,
      toggleSound: () => set((state) =&gt; ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'app-settings',
    }
  )
);
