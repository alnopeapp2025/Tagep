import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // تفعيل الـ Source Maps للمساعدة في تتبع الأخطاء إن وجدت
    sourcemap: false,
    // إعدادات لضمان توليد أسماء ملفات فريدة لتجاوز الكاش (Cache Busting)
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
})
