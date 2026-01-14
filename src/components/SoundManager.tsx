import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/sound-store';

export function SoundManager() {
  const { soundEnabled } = useSettingsStore();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!soundEnabled) return;
      
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"], input, select, .cursor-pointer');

      if (clickable) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [soundEnabled]);

  return null;
}
