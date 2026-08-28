import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // '/' locally; the GitHub Pages workflow sets VITE_BASE=/<repo>/ (or '/' with a custom domain)
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, // Vite default port, will auto-increment if taken
    host: true, // Allow external connections
    open: true, // Automatically open browser
    strictPort: false, // Auto-increment port if taken
  },
})

