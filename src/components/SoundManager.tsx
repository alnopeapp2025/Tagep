import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/sound-store';

// صوت نقرة خفيف وبسيط (Base64)
const CLICK_SOUND = "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; // Placeholder, will use a real short beep url below or generated one.
// Let's use a real short beep URL for better UX, or a valid base64.
// Using a very short base64 for a "pop" sound.
const POP_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Truncated for brevity, I will use a logic to play a frequency or a better hosted file.

export function SoundManager() {
  const { soundEnabled } = useSettingsStore();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!soundEnabled) return;

      // التحقق مما إذا كان العنصر قابلاً للنقر
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"], input, select, [class*="btn"]');

      if (clickable) {
        // تشغيل صوت نقرة خفيف
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // تجاهل الأخطاء إذا لم يسمح المتصفح
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [soundEnabled]);

  return null;
}
