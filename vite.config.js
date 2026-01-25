import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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

