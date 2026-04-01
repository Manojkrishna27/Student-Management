import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: import.meta.env.MODE === 'production' ? '/student-management-system/' : '/', // Update to your GitHub repo name e.g. '/yourusername/student-management-system/'
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})

