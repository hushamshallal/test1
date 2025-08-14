import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ❗️ استبدل 'test1' باسم مستودعك في GitHub إذا كان مختلفاً
  base: "/test1/",
  resolve: {
    alias: {
      // هذا السطر يضبط المسار '@' ليشير إلى مجلد 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }
})
