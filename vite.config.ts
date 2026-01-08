import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // استخدام شرط: إذا كان الأمر بناء (build) نستخدم مسار المستودع، وإلا نستخدم المسار الجذري للتطوير
  base: command === 'build' ? '/Tagep/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
